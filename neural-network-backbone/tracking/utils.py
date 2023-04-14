from typing import List

import numpy as np

import torch

from supervision.detection.core import Detections
from bytetracker.byte_tracker import STrack
from onemetric.cv.utils.iou import box_iou_batch


# converts Detections into format that can be consumed by match_detections_with_tracks function
def detections2boxes(detections: Detections) -> torch.Tensor:
    return torch.Tensor(np.hstack((
        detections.xyxy,
        detections.confidence[:, np.newaxis],
        detections.class_id[:, np.newaxis]
    )))


# converts List[STrack] into format that can be consumed by match_detections_with_tracks function
def tracks2boxes(tracks: List[STrack]) -> np.ndarray:
    return np.array([
        track[0:4] for track in tracks
    ], dtype=float)


# matches our bounding boxes with predictions
def match_detections_with_tracks(
        detections: Detections,
        tracks: List[STrack]
) -> Detections:
    if not np.any(detections.xyxy) or len(tracks) == 0:
        return np.empty((0,))

    tracks_boxes = tracks2boxes(tracks=tracks)
    iou = box_iou_batch(tracks_boxes, detections.xyxy)
    track2detection = np.argmax(iou, axis=1)

    tracker_ids = [None] * len(detections)

    for tracker_index, detection_index in enumerate(track2detection):
        if iou[tracker_index, detection_index] != 0:
            tracker_ids[detection_index] = tracks[tracker_index][4]

    return tracker_ids
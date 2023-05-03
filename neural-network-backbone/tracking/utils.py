from typing import List

import numpy as np
import torch
from bytetracker.byte_tracker import STrack
from onemetric.cv.utils.iou import box_iou_batch
from supervision.detection.core import Detections


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


def filter_detections(dets: Detections, mask: np.ndarray, inplace: bool = False):
    if inplace:
        dets.xyxy = dets.xyxy[mask]
        dets.confidence = dets.confidence[mask]
        dets.class_id = dets.class_id[mask]
        dets.tracker_id = dets.tracker_id[mask] if dets.tracker_id is not None else None

        return dets
    else:
        return Detections(xyxy=dets.xyxy[mask],
                          confidence=dets.confidence[mask],
                          class_id=dets.class_id[mask],
                          tracker_id=dets.tracker_id[mask] if dets.tracker_id is not None else None)

import os
from dataclasses import dataclass

import numpy as np
from roboflow import Roboflow
from supervision import BoxAnnotator

from supervision.draw.color import ColorPalette
from supervision.video import get_video_frames_generator
from supervision.video import VideoInfo, VideoSink

from tracking.utils import *
from tracking.colors import COLORS

from bytetracker import BYTETracker

import operator

@dataclass(frozen=True)
class BYTETrackerArgs:
    track_thresh: float = 0.25
    track_buffer: int = 30
    match_thresh: float = 0.8
    aspect_ratio_thresh: float = 3.0
    min_box_area: float = 1.0
    mot20: bool = False


SOURCE_VIDEO_PATH = os.path.join(os.getcwd(), '2023-04-07 22-16-44.mkv')


rf = Roboflow(api_key="bdAvwORYXz3sYBNRPlIG")
project = rf.workspace().project("diploma-qgouc")
classes = project.classes
model = project.version(2).model

CLASS_NAMES = list(classes.keys())


# # create frame generator
# generator = get_video_frames_generator(SOURCE_VIDEO_PATH)
# # create instance of BoxAnnotator
# box_annotator = BoxAnnotator(color=ColorPalette(COLORS), thickness=4, text_thickness=4, text_scale=2)
# # acquire first video frame
# iterator = iter(generator)
# frame = next(iterator)
# # model prediction on single frame and conversion to supervision Detections
# results = dict(model.predict(frame).json())
# detections = Detections.from_roboflow(results, CLASS_NAMES)
# # format custom labels
# labels = [
#     f"{CLASS_NAMES[class_id]} {confidence:0.2f}"
#     for _, confidence, class_id, tracker_id
#     in detections
# ]
# # annotate and display frame
# frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
#
# plot_image(frame)

# create BYTETracker instance
byte_tracker = BYTETracker(track_thresh=0.25, track_buffer=30)
# create VideoInfo instance
video_info = VideoInfo.from_video_path(SOURCE_VIDEO_PATH)
# create frame generator
generator = get_video_frames_generator(SOURCE_VIDEO_PATH)
# create instance of BoxAnnotator and LineCounterAnnotator
box_annotator = BoxAnnotator(color=ColorPalette(COLORS), thickness=4, text_thickness=4, text_scale=2)

CLASS_ID = [x for x in range(1, 11)]

DEST_VIDEO_PATH = os.path.join(os.getcwd(), 'out.mkv')

# open target video file
with VideoSink(DEST_VIDEO_PATH, video_info) as sink:
    count = 0
    # loop over video frames
    for frame in generator:
        count += 1
        print(count)
        # model prediction on single frame and conversion to supervision Detections
        results = dict(model.predict(frame).json())
        detections = Detections.from_roboflow(results, CLASS_NAMES)
        # filtering out detections with unwanted classes
        # mask = np.array([class_id in CLASS_ID for class_id in detections.class_id], dtype=bool)
        # detections.filter(mask=mask, inplace=True)

        # tracking detections
        tracks = byte_tracker.update(detections2boxes(detections), None)
        tracker_id = match_detections_with_tracks(detections=detections, tracks=tracks)
        detections.tracker_id = np.array(tracker_id)
        # filtering out detections without trackers
        # mask = np.array([tracker_id is not None for tracker_id in detections.tracker_id], dtype=bool)
        # detections.filter(mask=mask, inplace=True)
        # format custom labels
        labels = [
            f"#{tracker_id} {CLASS_NAMES[class_id]} {confidence:0.2f}"
            for _, confidence, class_id, tracker_id
            in detections
        ]
        # annotate and display frame
        frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
        sink.write_frame(frame)

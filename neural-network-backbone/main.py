import argparse
import json
import os
import sys

import cv2
from bytetracker import BYTETracker
from roboflow import Roboflow
from supervision import BoxAnnotator
from supervision.draw.color import ColorPalette
from supervision.video import VideoInfo, VideoSink
from supervision.video import get_video_frames_generator

from tracking.colors import convert_to_hex_color
from tracking.utils import *


def main(args):
    SOURCE_VIDEO_PATH = args.input

    rf = Roboflow(api_key="bdAvwORYXz3sYBNRPlIG")
    project = rf.workspace().project("full-dataset-4ekr5")
    # model = project.version(5).model
    model = torch.hub.load('ultralytics/yolov5', 'custom', path=args.weights)
    model.conf = 0.4
    # classes = project.classes
    classes = model.names

    project_colors = list(map(convert_to_hex_color, project.colors.values()))

    # CLASS_NAMES = list(classes.keys())
    CLASS_NAMES = list(classes.values())

    # create BYTETracker instance
    byte_tracker = BYTETracker(track_thresh=0.3, track_buffer=30)
    # create VideoInfo instance
    video_info = VideoInfo.from_video_path(SOURCE_VIDEO_PATH)
    # create frame generator
    generator = get_video_frames_generator(SOURCE_VIDEO_PATH)
    # create instance of BoxAnnotator and LineCounterAnnotator
    box_annotator = BoxAnnotator(color=ColorPalette(project_colors), thickness=2, text_thickness=2, text_scale=0.6)

    CLASS_ID = list(map(lambda x: CLASS_NAMES.index(x), args.filter.split() if args.filter else CLASS_NAMES))

    DEST_VIDEO_PATH = os.path.join(args.output, 'output.webm')

    os.makedirs(args.output, exist_ok=True)

    json_output = {
        "predictions": [],
        "statistics": {
            "totalUniqueObjects": 0,
            "distributionByClass": {}
        }
    }

    statistics = {}

    video_sink = VideoSink(DEST_VIDEO_PATH, video_info)
    video_sink.__dict__['_VideoSink__fourcc'] = cv2.VideoWriter_fourcc(*"vp80")

    # open target video file
    with video_sink as sink:
        count = 0
        # loop over video frames
        for frame in generator:
            count += 1
            print(f'{count}/{video_info.total_frames}')
            sys.stdout.flush()

            # model prediction on single frame and conversion to supervision Detections
            # results = model.predict(frame).json()
            results = model(frame)
            # detections = Detections.from_roboflow(results, CLASS_NAMES)
            detections = Detections.from_yolov5(results)

            # filtering out detections with unwanted classes
            mask = np.array([class_id in CLASS_ID for class_id in detections.class_id], dtype=bool)
            filter_detections(detections, mask, inplace=True)

            # tracking detections
            tracks = byte_tracker.update(detections2boxes(detections), None)
            tracker_id = match_detections_with_tracks(detections=detections, tracks=tracks)
            detections.tracker_id = np.array(tracker_id)

            # filtering out detections without trackers
            mask = np.array([tracker_id is not None for tracker_id in detections.tracker_id], dtype=bool)
            filter_detections(detections, mask, inplace=True)

            if args.output_type in ['json', 'all']:
                update_statistics(detections, statistics)
                json_output["predictions"].append(detection_to_json(detections))

            if args.output_type in ['video', 'all']:
                # format custom labels
                labels = [
                    f"#{tracker_id} {CLASS_NAMES[class_id]} {confidence:0.2f}"
                    for _, confidence, class_id, tracker_id
                    in detections
                ]
                # annotate and display frame
                frame = box_annotator.annotate(scene=frame, detections=detections, labels=labels)
                sink.write_frame(frame)

    if args.output_type in ['json', 'all']:
        stats = aggregate_statistics(statistics, CLASS_NAMES)
        json_output['statistics']['distributionByClass'] = stats
        json_output['statistics']['totalUniqueObjects'] = len(statistics.keys())

        with open(os.path.join(args.output, 'predictions.json'), mode='w') as output_preds:
            json.dump(json_output, output_preds)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='detect objects on video')
    parser.add_argument('--input', required=True, dest='input', type=str, help='Video to recognize')
    parser.add_argument('--output', required=True, dest='output', type=str, help='Path to write output video')
    parser.add_argument('--filter-classes', dest='filter', type=str, help='Classes to filter out from output')
    parser.add_argument('--output-type', required=True, dest='output_type', choices=['json', 'video', 'all'],
                        help='Output can be video or json with results or both')
    parser.add_argument('--weights', dest='weights', default='./dist/backend/neural-network-backbone/weights/best.pt', help='YOLOv5 weights')

    args = parser.parse_args()

    main(args)

"use client";
import React from 'react';
import { useRobotStore } from '@/stores/robotStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Radar } from "lucide-react";
import RadarDisplayContent from './RadarDisplayContent';

const RadarDialog = () => {
  const isOpen = useRobotStore.use.radarDialog();
  const closeRadarDialog = useRobotStore.use.closeRadarDialog();
  const detectedObjects = useRobotStore.use.detectedObjects();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeRadarDialog()}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-[90vw] h-[90vh] bg-black border-red-900 p-0 gap-0">

        <div className='flex flex-col gap-2'>
          <div className="flex items-center p-2">
            <Radar className="w-6 h-6 text-red-500" />
            <div>
              <DialogTitle className="text-red-500 text-xl font-bold">
                Radar Display
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Real-time object detection and tracking • {detectedObjects.length} objects detected
              </DialogDescription>
            </div>
          </div>
          <div className="h-full flex-1 p-2">
            <RadarDisplayContent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RadarDialog;
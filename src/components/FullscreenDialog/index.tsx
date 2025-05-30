'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2, X } from 'lucide-react';
import screenfull from 'screenfull';

const FullscreenDialog = () => {
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (screenfull.isEnabled) {
      setShowDialog(true);
    }
    const handleFullscreenChange = () => {
      console.log('Fullscreen changed:', screenfull.isFullscreen);
    };

    if (screenfull.isEnabled) {
      screenfull.on('change', handleFullscreenChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleFullscreenChange);
      }
    };
  }, []);

  const handleEnterFullscreen = async () => {
    try {
      if (screenfull.isEnabled) {
        await screenfull.request();
        setShowDialog(false);
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  };

  const handleDecline = () => {
    setShowDialog(false);
  };

  return (
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-blue-600" />
              Get the Full Experience
            </DialogTitle>
            <DialogDescription>
              For the best experience, we recommend switching to fullscreen mode. 
              This gives you more space and reduces distractions.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleDecline}>
              <X className="w-4 h-4 mr-2" />
              Not Now
            </Button>
            <Button onClick={handleEnterFullscreen}>
              <Maximize2 className="w-4 h-4 mr-2 text-white" color='black'/>
              Enter Fullscreen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
 
  );
};

export default FullscreenDialog;
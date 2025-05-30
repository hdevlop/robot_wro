import { useEffect, useState } from 'react';
import { useRobotStore } from '@/stores/robotStore';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const THRESHOLDS = {
   CO_CRITICAL: 100,
   BUTANE_CRITICAL: 5000,
   AQI_CRITICAL: 200,
   TEMP_HIGH: 35,
   TEMP_LOW: -1,
   HUMIDITY_HIGH: 80
};

export const AlarmComponent = () => {
   const sensors: any = useRobotStore.use.sensors();
   const criticalAlarm = useRobotStore.use.criticalAlarm();
   const clearAlarm = useRobotStore.use.clearAlarm();

   const [activeThresholds, setActiveThresholds] = useState([]);
   const [isDialogOpen, setIsDialogOpen] = useState(false);

   useEffect(() => {
      const exceeded = [];
      const temp = parseFloat(sensors.temperature);
      const humidity = parseFloat(sensors.humidity);
      const co = parseInt(sensors.co);
      const airQuality = parseInt(sensors.airQuality);

      if (co >= THRESHOLDS.CO_CRITICAL) {
         exceeded.push({
            type: 'CO',
            value: co,
            threshold: THRESHOLDS.CO_CRITICAL,
            message: `Dangerous CO levels (${co} ppm)`,
            severity: 'critical'
         });
      }

      if (temp >= THRESHOLDS.TEMP_HIGH) {
         exceeded.push({
            type: 'Temperature',
            value: temp,
            threshold: THRESHOLDS.TEMP_HIGH,
            message: `Temperature too high (${temp}°C)`,
            severity: 'critical'
         });
      }

      if (temp <= THRESHOLDS.TEMP_LOW) {
         exceeded.push({
            type: 'Temperature',
            value: temp,
            threshold: THRESHOLDS.TEMP_LOW,
            message: `Temperature too low (${temp}°C)`,
            severity: 'critical'
         });
      }

      if (humidity >= THRESHOLDS.HUMIDITY_HIGH) {
         exceeded.push({
            type: 'Humidity',
            value: humidity,
            threshold: THRESHOLDS.HUMIDITY_HIGH,
            message: `Excessive humidity (${humidity}%)`,
            severity: 'warning'
         });
      }

      if (airQuality >= THRESHOLDS.AQI_CRITICAL) {
         exceeded.push({
            type: 'Air Quality',
            value: airQuality,
            threshold: THRESHOLDS.AQI_CRITICAL,
            message: `Unhealthy air quality (AQI: ${airQuality})`,
            severity: 'critical'
         });
      }

      setActiveThresholds(exceeded);
   }, [sensors]);

   useEffect(() => {
      if (criticalAlarm || activeThresholds.length > 0) {
         setIsDialogOpen(true);
      }
   }, [criticalAlarm, activeThresholds.length]);

   const hasCriticalAlarms = activeThresholds.some(alarm => alarm.severity === 'critical');
   const hasAnyAlarms = criticalAlarm || activeThresholds.length > 0;

   const handleClearAll = () => {
      clearAlarm();
      setIsDialogOpen(false);
   };

   return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  {hasAnyAlarms ? (
                     <>
                        <AlertTriangle className={`h-5 w-5 ${hasCriticalAlarms ? 'text-red-500' : 'text-yellow-500'}`} />
                        {hasCriticalAlarms ? 'Critical System Alarms' : 'System Warnings'}
                     </>
                  ) : (
                     <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        System Status
                     </>
                  )}
               </DialogTitle>
               <DialogDescription>
                  {hasAnyAlarms
                     ? 'Immediate attention required for detected issues'
                     : 'All systems operating within normal parameters'
                  }
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
               {/* Arduino Critical Alarm */}
               {criticalAlarm && (
                  <Alert variant="destructive">
                     <XCircle className="h-4 w-4" />
                     <AlertDescription className="font-medium">
                        🚨 Critical conditions detected by robot sensors
                     </AlertDescription>
                  </Alert>
               )}

               {/* Threshold-Based Alarms */}
               {activeThresholds.length > 0 && (
                  <div className="space-y-3">
                     <h3 className="font-semibold text-sm text-muted-foreground">
                        Threshold Violations ({activeThresholds.length})
                     </h3>

                     {activeThresholds.map((alarm, index) => (
                        <Alert
                           key={index}
                           variant={alarm.severity === 'critical' ? 'destructive' : 'default'}
                           className="border-l-4"
                        >
                           <AlertTriangle className="h-4 w-4" />
                           <AlertDescription>
                              <div className="flex justify-between items-start">
                                 <div className="space-y-1">
                                    <p className="font-medium">{alarm.message}</p>
                                    <p className="text-sm text-muted-foreground">
                                       Current: <span className="font-mono">{alarm.value}</span> |
                                       Threshold: <span className="font-mono">{alarm.threshold}</span>
                                    </p>
                                 </div>
                                 <Badge variant={alarm.severity === 'critical' ? 'destructive' : 'secondary'}>
                                    {alarm.severity}
                                 </Badge>
                              </div>
                           </AlertDescription>
                        </Alert>
                     ))}
                  </div>
               )}

               {/* Actions */}
               <div className="flex gap-2 pt-4">
                  {hasAnyAlarms && (
                     <Button
                        onClick={handleClearAll}
                        variant="destructive"
                        className="flex-1"
                     >
                        Clear All Alarms
                     </Button>
                  )}
                  <Button
                     onClick={() => setIsDialogOpen(false)}
                     variant="outline"
                     className="flex-1"
                  >
                     Close
                  </Button>
               </div>

               {/* No Alarms State */}
               {!hasAnyAlarms && (
                  <Alert>
                     <CheckCircle className="h-4 w-4" />
                     <AlertDescription>
                        All sensor readings are within safe operating limits. System monitoring continues.
                     </AlertDescription>
                  </Alert>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};
import React from 'react';
import { useRobotStore } from '@/stores/robotStore';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SimpleTerminal = () => {
   const terminalMessages = useRobotStore.use.terminalMessages();
   const clearTerminal = useRobotStore.use.clearTerminal();

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700" >
               Terminal ({terminalMessages.length})
            </Button>
         </DialogTrigger>

         <DialogContent className="max-w-4xl h-[80vh] bg-black text-white p-0">
            <DialogHeader className="p-4 bg-gray-800 border-b border-gray-700">
               <div className="flex justify-between items-center">
                  <DialogTitle className="text-white">Serial Monitor</DialogTitle>
                  <Button onClick={clearTerminal}  size="sm"   variant="destructive" >
                     Clear
                  </Button>
               </div>
            </DialogHeader>

            <div className="h-full overflow-y-auto p-4 font-mono text-sm">
               {terminalMessages.map((msg, index) => (
                  <div key={index} className="mb-1">
                     {msg}
                  </div>
               ))}
               {terminalMessages.length === 0 && (
                  <div className="text-gray-500">No messages yet...</div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};

export default SimpleTerminal;
import { ChamferContainer } from "@/components/ChamferContainer";
import NIcon from "@/components/NIcon";
import { cn } from "@/lib/utils";

export const ControlButton = ({
   icon = null,
   className = '',
   iconSize = 80,
   text = '',
   onClick = null,
   active,
   onMouseDown = null,
   onMouseUp = null,
   onTouchStart= null,
   onTouchEnd= null
}) => {

   const hasIcon = icon !== null;
   const hasText = text !== '';

   return (
      <div className='w-full h-full flex justify-center items-center cursor-pointer'>
         <div className={cn("h-[70px] min-w-20 w-20 lg:h-20 flex gap-2 relative justify-center items-center", className, active ? 'opacity-100' : 'opacity-60')}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}

         >
            <ChamferContainer />

            {hasIcon && <NIcon icon={icon} size={iconSize} color="#ef4444" />}
            {hasText && <span className=" font-bold text-xl lg:text-2xl">{text}</span>}

         </div>
      </div>
   )
}

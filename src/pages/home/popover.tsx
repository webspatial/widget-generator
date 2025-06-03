import {
  useContext,
  CSSProperties,
} from 'react'

import { DialogContext } from './Dialog'

export function PopoverContent() {
  const { state, dispatch } = useContext(DialogContext)

  if (!state.open) {
    return null
  }

  const style: CSSProperties = {
    // 120 is adjusted value according to the UI design  
    top: (state.domRect?.top || 0) + 120,
    left: state.domRect?.left,
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    state.callback?.()
  }

  return <div
    style={{
      '--xr-back': 16
    }}
    enable-xr
    className='absolute top-0 left-0 w-full h-full'
    onClick={e => {
      e.stopPropagation()
      dispatch({ open: false })
    }}
  >
    <div enable-xr onClick={onClick} style={style} className="absolute text-white thick-material pl-[32px]  w-[230px] h-[70px] rounded-full text-[17px] leading-[70px] flex  "> Delete </div>
  </div>
}

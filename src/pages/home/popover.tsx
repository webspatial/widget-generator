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
    top: 0,
    left: 0,
    '--xr-back': 16
  }

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    state.callback?.()
  }

  return <div
    enable-xr
    className='absolute top-0 left-0 w-full h-full'
    onClick={e => {
      e.stopPropagation()
      dispatch({ open: false })
    }}
  >
    <div enable-xr onClick={onClick} style={style} className="absolute translucent-material pl-[32px] bg-gray-300 w-[130px] h-[70px] rounded-full text-[17px] leading-[70px] flex  "> Delete </div>
  </div>
}

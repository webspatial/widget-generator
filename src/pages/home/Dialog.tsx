import { Dispatch, createContext, ReactNode, useMemo, useState } from 'react'

type DialogState = {
  open: boolean
  callback?: () => void,
}

type DialogAction = DialogState

type DialogContextType = {
  state: DialogState
  dispatch: Dispatch<DialogAction>
}

export const DialogContext = createContext<DialogContextType>(
  {} as DialogContextType,
)

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({
    open: false,
  })
  const value = useMemo(() => ({ state, dispatch: setState }), [state])

  return (
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  )
}

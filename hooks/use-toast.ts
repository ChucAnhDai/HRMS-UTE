"use client"
import * as React from "react"

export type ToastProps = {
  id?: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const listeners: Array<(state: ToastProps[]) => void> = []
let memoryState: ToastProps[] = []

function dispatch(action: { type: "ADD_TOAST"; toast: ToastProps } | { type: "REMOVE_TOAST"; toastId?: string }) {
  if (action.type === "ADD_TOAST") {
    memoryState = [...memoryState, action.toast]
  }
  if (action.type === "REMOVE_TOAST") {
    memoryState = memoryState.filter((t) => t.id !== action.toastId)
  }
  listeners.forEach((listener) => listener(memoryState))
}

export function toast({ ...props }: Omit<ToastProps, "id">) {
  const id = Math.random().toString(36).substring(2, 9)
  dispatch({ type: "ADD_TOAST", toast: { ...props, id } })
  
  if (props.variant !== "destructive") {
      setTimeout(() => {
          dispatch({ type: "REMOVE_TOAST", toastId: id })
      }, 5000)
  }
  
  return {
    id,
    dismiss: () => dispatch({ type: "REMOVE_TOAST", toastId: id }),
  }
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastProps[]>(memoryState)

  React.useEffect(() => {
    listeners.push(setToasts)
    return () => {
      const index = listeners.indexOf(setToasts)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    toast,
    toasts,
    dismiss: (toastId?: string) => dispatch({ type: "REMOVE_TOAST", toastId }),
  }
}

import { painManager } from '@/lib/whiteboard/PainManager'
import './index.css'
import { useEffect, useState } from "react"

export default function EditTool(props:{showTool:(show:boolean) => void}) {
    const [canDraw, setCanDraw] = useState<boolean>(true)
    const [canUndo, setCanUndo] = useState<boolean>(false)
    const [canRedo, setCanRedo] = useState<boolean>(false)
    const [canEdit, setCanEdit] = useState<boolean>(true)
    const onRemoveAll = () => {
        console.log('remove all')
        painManager.clear()
        setCanUndo(painManager.canUndo())
        setCanRedo(painManager.canRedo())
    }

    const onUndo = () => {
        console.log('undo')
        painManager.undo()
        setCanUndo(painManager.canUndo())
        setCanRedo(painManager.canRedo())
    }

    const onRedo = () => {
        console.log('redo')
        painManager.redo()
        setCanUndo(painManager.canUndo())
        setCanRedo(painManager.canRedo())
    }

    const onErase = () => {
        painManager.changeDrawType('erase')
        setCanDraw(false)
    }

    const onDraw = () => {
        console.log('draw') 
        painManager.changeDrawType('draw')
        setCanDraw(true)
    }

    const onSubmit = () => {
        console.log('submit')
        painManager.active(false)
        setCanEdit(false)
    }

    const onEdit = () => {
        console.log('edit')
        painManager.active()
        setCanEdit(true)
    }

    useEffect(() => {
        props.showTool(canEdit)
    }, [canEdit])

    useEffect(() => {
        painManager.onDraw = () => {
            setCanUndo(painManager.canUndo())
            setCanRedo(painManager.canRedo())
        }
    }, [])

    return<div enable-xr className='edit-tool-container'>
            <div className="edit-tool-bar" style={{width: `${canEdit ? '358px' : '141px'}`}}>
            {
                canEdit? <><div className='edit-btn-container' onClick={onRemoveAll}>
                        <IconClear className='edit-btn-img' />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className={`edit-btn-container ${canUndo ? '' : 'edit-disable'}`} onClick={onUndo}>
                        <IconUndo className='edit-btn-img' />
                    </div>
                    <div className={`edit-btn-container ${canRedo ? '' : 'edit-disable'}`} onClick={onRedo}>
                        <IconUndo className='edit-btn-img' style={{transform:"scaleX(-1)"}} />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className={'edit-btn-container' + (!canDraw ? ' edit-btn-selected' : '')} onClick={onErase}>
                        <IconErase className='edit-btn-img' />
                    </div>
                    <div className={'edit-btn-container' + (canDraw ? ' edit-btn-selected' : '')} onClick={onDraw}>
                        <IconBrush className='edit-btn-img' />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className='edit-btn-container' onClick={onSubmit}>
                        <IconSubmit className='edit-btn-img' />
                    </div>
                </> : <div className='edit-start-container' onClick={onEdit}>
                    <IconEdit className='edit-start-img' />
                    <div className='edit-start-txt'>Edit</div>
                </div>
            }
        </div>
    </div>
  }

  function IconClear({ className }:{ className?:string }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <g clip-path="url(#clip0_255_11293)">
            <g opacity="0.15" clip-path="url(#clip1_255_11293)">
                <rect x="7.05" y="4.05" width="9.9" height="15.9" rx="1.95" stroke="#51F5FF" stroke-width="0.1"/>
                <rect x="19.95" y="7.05" width="9.9" height="15.9" rx="1.95" transform="rotate(90 19.95 7.05)" stroke="#51F5FF" stroke-width="0.1"/>
                <rect x="5.05" y="5.05" width="13.9" height="13.9" rx="1.95" stroke="#FFEA7E" stroke-width="0.1"/>
                <circle cx="12" cy="12" r="7.95" stroke="#FF4BC2" stroke-width="0.1"/>
                <path d="M12.0498 11.9502H24V12.0498H12.0498V24H11.9502V12.0498H0V11.9502H11.9502V0H12.0498V11.9502Z" fill="#FF3838"/>
                <path d="M24.0652 0.0351562L12.0994 12L23.99 23.8906C24.0176 23.9183 24.0176 23.9626 23.99 23.9902C23.9623 24.0179 23.918 24.0179 23.8904 23.9902L11.9998 12.0996L0.0349121 24.0664L-0.0656738 23.9658L11.8992 12L0.00952148 0.110352C-0.0180782 0.0827025 -0.0180992 0.0374017 0.00952148 0.00976562C0.0371561 -0.017869 0.0824535 -0.017838 0.110107 0.00976562L11.9998 11.8994L23.9656 -0.0654297L24.0652 0.0351562Z" fill="#FF3838"/>
            </g>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2578 4L9.74219 4V5.51563L14.2578 5.51563V4ZM16.2578 5.51563V5.2C16.2578 4.0799 16.2578 3.51984 16.0398 3.09202C15.8481 2.71569 15.5421 2.40973 15.1658 2.21799C14.738 2 14.1779 2 13.0578 2L10.9422 2C9.82208 2 9.26203 2 8.83421 2.21799C8.45788 2.40973 8.15192 2.71569 7.96017 3.09202C7.74219 3.51984 7.74219 4.0799 7.74219 5.2V5.51562H4.5H3L3 7.51562H4.56505L4.94075 19.0663C4.99338 20.6843 6.32028 21.9688 7.93916 21.9688H16.1242C17.7459 21.9688 19.074 20.6801 19.1229 19.0592L19.4709 7.51563H21V5.51563H19.5312H16.2578ZM17.4683 7.51563H16.2578L7.74219 7.51563L6.56801 7.51562L6.93819 19.001C6.95558 19.5404 7.39792 19.9688 7.93767 19.9688H16.1256C16.6663 19.9688 17.109 19.539 17.1252 18.9986L17.4683 7.51563ZM9.5 9H11.0039L11.0039 18H9.5L9.5 9ZM13 9L14.4961 9L14.4961 18H13L13 9Z" fill="#FF2626"/>
        </g>
        <defs>
            <clipPath id="clip0_255_11293">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
            <clipPath id="clip1_255_11293">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
  }

  function IconUndo({ className, style }:{ className?:string, style?:React.CSSProperties  }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5496 11.6616L10.9364 15.5L9.43672 16.8232L4 10.6616L8.99555 5L10.4952 6.32324L7.5496 9.66162H12.3336C16.1996 9.66162 19.3336 12.7956 19.3336 16.6616V18.6616H17.3336V16.6616C17.3336 13.9002 15.095 11.6616 12.3336 11.6616H7.5496Z" fill="white"/>
    </svg>
    
  }

  function IconErase({ className }:{ className?:string }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* <mask id="path-1-inside-1_255_11310" fill="white"> */}
    <rect x="12.842" y="3" width="10.1228" height="13.9188" rx="1" transform="rotate(45 12.842 3)"/>
    {/* </mask> */}
    <rect x="12.842" y="3" width="10.1228" height="13.9188" rx="1" transform="rotate(45 12.842 3)" stroke="white" stroke-width="3" mask="url(#path-1-inside-1_255_11310)"/>
    <path d="M7.70439 10.5925L12.8429 15.5265" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    </svg>    
  }

  function IconBrush({ className }:{ className?:string }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M17.5789 9.13574C18.5875 9.238 19.3748 10.0893 19.3748 11.125V14.125L19.3699 14.2275C19.322 14.698 18.9477 15.0722 18.4773 15.1201L18.3748 15.125H6.37476L6.27222 15.1201C5.80179 15.0722 5.42754 14.698 5.37964 14.2275L5.37476 14.125V11.125C5.37476 10.0893 6.16198 9.238 7.17065 9.13574L7.37476 9.125H9.87476V10.625H7.37476C7.09861 10.625 6.87476 10.8489 6.87476 11.125V13.625H17.8748V11.125C17.8748 10.8489 17.6509 10.625 17.3748 10.625H14.8748V9.125H17.3748L17.5789 9.13574Z" fill="white"/>
    <path d="M12.3748 3.125C14.5839 3.125 16.3748 4.91586 16.3748 7.125V10.625H14.8748V7.125C14.8748 5.74429 13.7555 4.625 12.3748 4.625C10.994 4.625 9.87476 5.74429 9.87476 7.125V10.625H8.37476V7.125C8.37476 4.91586 10.1656 3.125 12.3748 3.125Z" fill="white"/>
    <path d="M8.62188 14.1934C8.53505 15.1482 8.30108 16.6079 7.87384 17.8984C7.70297 18.4145 7.49278 18.9257 7.23614 19.375H12.9109L13.7039 17.79C13.8594 17.479 14.2083 17.3158 14.5467 17.3955C14.8852 17.4754 15.1248 17.7772 15.1248 18.125V19.375H16.6248V14.625H18.1248V20.125C18.1248 20.5392 17.789 20.875 17.3748 20.875H14.3748C14.1822 20.875 14.0086 20.8 13.8758 20.6807C13.7403 20.8028 13.5636 20.875 13.3748 20.875H5.37481C4.9961 20.875 4.67704 20.5926 4.63067 20.2168C4.58439 19.8409 4.82571 19.4893 5.19317 19.3975L5.24981 19.3789C5.38883 19.3238 5.57763 19.1787 5.79571 18.8564C6.03828 18.4979 6.259 18.0037 6.45001 17.4268C6.83103 16.2758 7.04788 14.9351 7.12774 14.0566L8.62188 14.1934Z" fill="white"/>
    </svg>    
  }

  function IconSubmit({ className }:{ className?:string }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 12L10.6667 16L18 8" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
  }

  function IconEdit({ className }:{ className?:string }){
    return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.32807 15.5078L7.60947 13.1051L15.3003 5.41421L17.4216 7.53553L9.73079 15.2264L7.32807 15.5078ZM10.8993 16.8863C10.7402 17.0454 10.532 17.1462 10.3085 17.1724L6.304 17.6414C5.66267 17.7165 5.11935 17.1732 5.19446 16.5319L5.66346 12.5273C5.68964 12.3038 5.79044 12.0957 5.94957 11.9365L14.5932 3.29289C14.9837 2.90237 15.6169 2.90237 16.0074 3.29289L19.543 6.82843C19.9335 7.21895 19.9335 7.85212 19.543 8.24264L10.8993 16.8863ZM3 21L21 21V19L3 19V21Z" fill="white"/>
    </svg>
    
  }
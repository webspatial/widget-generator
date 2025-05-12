import { painManager } from '@/lib/whiteboard/PainManager'
import './index.css'
import { useEffect, useState } from "react"

export default function EditTool() {
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
        console.log('erase')
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
        painManager.onDraw = () => {
            setCanUndo(painManager.canUndo())
            setCanRedo(painManager.canRedo())
        }
    }, [])

    return<div className='edit-tool-container'>
            <div className="edit-tool-bar" style={{width: `${canEdit ? '358px' : '141px'}`}}>
            {
                canEdit? <><div className='edit-btn-container' onClick={onRemoveAll}>
                        <img className='edit-btn-img' src="assets/pages/whiteboard/edit/delete.png" />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className={`edit-btn-container ${canUndo ? '' : 'edit-disable'}`} onClick={onUndo}>
                        <img className='edit-btn-img' src="assets/pages/whiteboard/edit/undo.png" />
                    </div>
                    <div className={`edit-btn-container ${canRedo ? '' : 'edit-disable'}`} onClick={onRedo}>
                        <img className='edit-btn-img' style={{transform:"scaleX(-1)"}} src="assets/pages/whiteboard/edit/undo.png" />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className={'edit-btn-container' + (!canDraw ? ' edit-btn-selected' : '')} onClick={onErase}>
                        <img className='edit-btn-img' src="assets/pages/whiteboard/edit/erase.png" />
                    </div>
                    <div className={'edit-btn-container' + (canDraw ? ' edit-btn-selected' : '')} onClick={onDraw}>
                        <img className='edit-btn-img' src="assets/pages/whiteboard/edit/brush.png" />
                    </div>
                    <div className="edit-tool-divider" />
                    <div className='edit-btn-container' onClick={onSubmit}>
                        <img className='edit-btn-img' src="assets/pages/whiteboard/edit/submit.png" />
                    </div>
                </> : <div className='edit-start-container' onClick={onEdit}>
                    <img className='edit-start-img' src="assets/pages/whiteboard/edit/edit.png" />
                    <div className='edit-start-txt'>Edit</div>
                </div>
            }
        </div>
    </div>
  }
import React, {Component, SyntheticEvent} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@material-ui/core';
import {autobind} from 'core-decorators';
import ChipInput from 'material-ui-chip-input';
import {action} from 'mobx';
import {Edit} from '@material-ui/icons';
import {BookmarkTreeNode} from '../model';

export default class BookmarkOptions extends Component<{root: BookmarkTreeNode}> {
    state: {isEdited: boolean} = {
        isEdited: false
    };

    @autobind
    onStartEdit(event:  React.MouseEvent<SVGSVGElement>): void {
        event.stopPropagation();
        this.setState({isEdited: true});
    }

    @autobind
    onStopEdit(): void {
        this.setState({isEdited: false});
    }

    @autobind
    @action
    private onChangeTitle({target: {value}}: React.ChangeEvent<HTMLInputElement>): void {
        const {root} = this.props;
        root.title = value;
    }

    @autobind
    @action
    onChangeTags(chips: string[]): void {
        // TODO `this.props.tags.replace(chips)`, и сделать сохранение
        // TODO - такой вариант тоже должен быть рабочим - `meta.tags = chips`
        const {root} = this.props;
        root.meta = {tags: chips};
    }

    // eslint-disable-next-line class-methods-use-this
    stopPropagation(event: SyntheticEvent<HTMLElement>): void {
        event.stopPropagation();
    }

    render(): React.ReactNode {
        const {root: {title, meta}} = this.props;
        const {isEdited} = this.state;
        return (
            <>
                <Edit fontSize='small' onClick={this.onStartEdit}/>
                <Dialog
                    fullWidth
                    open={isEdited}
                    onClose={this.onStopEdit}
                    aria-labelledby="form-dialog-title"
                    onClick={this.stopPropagation}
                    onKeyDown={this.stopPropagation}// TODO предотвращает не только работу дерева(для чего и сделано), но и выход по Esc
                >
                    <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText/> */}
                        <TextField
                            autoFocus
                            label='Title'
                            margin='dense'
                            value={title}
                            onChange={this.onChangeTitle}
                            fullWidth
                        />
                        <br/>
                        <ChipInput
                            label='Tags'
                            defaultValue={meta.tags}
                            onChange={this.onChangeTags}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        {/* TODO сохранять не на лету, а по кнопке */}
                        {/* <Button onClick={handleClose} color="primary"> */}
                        {/*    Cancel */}
                        {/* </Button> */}
                        {/* <Button onClick={handleClose} color="primary"> */}
                        {/*    Subscribe */}
                        {/* </Button> */}
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}
import React, { Component } from 'react';
import { Editor, createEditorState } from 'medium-draft';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import 'medium-draft/lib/index.css';
import style from './Edit.css';

const keyDown = (event) => {
  const e = event;
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
};

const remoteUrl = 'http://localhost:5000';

class Edit extends Component {
  constructor({ match }) {
    super();
    this.state = {
      title: 'New Post',
      editorState: createEditorState(),
      postId: match.params.postId,
    };
    this.onChange = this.onChange.bind(this);
    this.savePost = this.savePost.bind(this);
    this.discardPost = this.discardPost.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
  }

  onChange(state) {
    // console.log(convertToRaw(state.getCurrentContent()));
    this.setState({
      editorState: state,
    });
  }

  updateTitle(event) {
    const e = event;
    if (!e.target.textContent.length) {
      return;
    }
    this.setState({ title: e.target.textContent });
  }

  keyUp(event) {
    const e = event;
    this.setState({ displayPlaceholder: !e.target.textContent.length });
  }

  savePost() {
    window.fetch(`${remoteUrl}/api/post`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        title: this.state.title,
        createTime: Date.now(),
        content: this.state.editorState,
      }),
    }).then((res) => {
      if (res.status > 300) {
        throw new Error();
      }
      window.location.replace(`${remoteUrl}`);
    }).catch(err => console.error(err));
  }

  discardPost() {
    window.location.replace(`${remoteUrl}`);
  }

  render() {
    return (
      <div className={style.main}>
        <p>Creating a new post...</p>
        <div
          className={style.title}
          data-placeholder="Title"
          contentEditable
          onKeyDown={keyDown}
          onBlur={event => this.updateTitle(event)}
          suppressContentEditableWarning
        />
        <div className={style.editor}>
          <div className={style.editorInner}>
            <Editor
              ref={(editor) => { this.editor = editor; }}
              editorState={this.state.editorState}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div className={style.buttons}>
          <div className={style.button} onClick={this.discardPost}>Discard</div>
          <div className={style.button} onClick={this.savePost}>Save</div>
        </div>
      </div>
    );
  }
}

export default Edit;

import React, { Component } from 'react';
import { Editor, createEditorState } from 'medium-draft';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import mediumDraftExporter from 'medium-draft/lib/exporter';
import 'medium-draft/lib/index.css';
import style from './style/Edit.css';
import commonStyle from './style/Common.css';
import remoteUrl from './settings';

const keyDown = (event) => {
  const e = event;
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
};

class Edit extends Component {
  constructor({ match }) {
    super();
    this.state = {
      editorState: createEditorState(),
      postId: match.params.postId,
    };
    this.onChange = this.onChange.bind(this);
    this.savePost = this.savePost.bind(this);
    this.discardPost = this.discardPost.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.fetchPostContent = this.fetchPostContent.bind(this);
  }

  componentDidMount() {
    this.editor.focus();
    if (this.state.postId !== undefined) {
      console.log('mount');
      this.fetchPostContent();
    }
  }

  onChange(state) {
    this.setState({
      editorState: state,
    });
  }

  fetchPostContent() {
    window.fetch(`${remoteUrl}/api/raw-post/${this.state.postId}`, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'application/json' },
    }).then((res) => {
      if (res.status > 299) {
        throw new Error();
      }
      return res.json();
    }).then((body) => {
      const newEditor = EditorState.push(this.state.editorState, convertFromRaw(JSON.parse(body.raw_content)));
      this.setState({ editorState: newEditor, title: body.title });
    }).catch(err => console.error(err));
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
    const renderedHTML = mediumDraftExporter(this.state.editorState.getCurrentContent());
    const rawContentJson = JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));

    window.fetch(`${remoteUrl}/api/post`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        postId: this.state.postId,
        title: this.state.title === '' ? 'New Post' : this.state.title,
        content: renderedHTML,
        rawContent: rawContentJson,
      }),
    }).then((res) => {
      if (res.status > 300) {
        throw new Error();
      }
      window.location.replace('/');
    }).catch(err => console.error(err));
  }

  discardPost() {
    window.location.replace('/');
  }

  render() {
    const status = this.state.postId ? 'Editing post' : 'Creating a new post...';
    return (
      <div className={style.main}>
        <p>{status}</p>
        <div
          className={style.title}
          data-placeholder="Title"
          contentEditable
          onKeyDown={keyDown}
          onBlur={event => this.updateTitle(event)}
          suppressContentEditableWarning
        >{this.state.title}</div>
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
          <div className={`${commonStyle.button} ${style.button}`} onClick={this.discardPost}>Discard</div>
          <div className={`${commonStyle.button} ${style.button}`} onClick={this.savePost}>Save</div>
        </div>
      </div>
    );
  }
}

export default Edit;

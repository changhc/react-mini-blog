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

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'New Post',
			editorState: createEditorState(),
		};
		this.onChange = this.onChange.bind(this);
		this.savePost = this.savePost.bind(this);
		this.discardPost = this.discardPost.bind(this);
		this.updateTitle = this.updateTitle.bind(this);
	}

	componentDidMount() {
		this.refs.editor.focus();
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
		console.log(e.target.textContent.length)
		this.setState({ displayPlaceholder: !e.target.textContent.length });
	}

	savePost() {
		window.fetch(`${remoteUrl}/api/post`, {
			method: 'POST',
			mode: 'cors',
			headers: { 'Content-type': 'application/json'},
			body: JSON.stringify({
				title: this.state.title,
				content: this.state.editorState,
			})
		}).then(res => {
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
		const placeholder = `${style.placeholder} ${this.state.displayPlaceholder ? '' : style.hidden}`
		return (
			<div className={style.main}>
				<p>Creating a new post...</p>
				<h1
					data-placeholder="Title"
					contentEditable
					onKeyDown={keyDown}
					onBlur={event => this.updateTitle(event)}
					suppressContentEditableWarning
				/>
				<div className={style.editor}>
					<div className={style.editorInner}>
						<Editor
							ref="editor"
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

export default App;
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
}

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: createEditorState(),
		};
		this.onChange = this.onChange.bind(this);
		this.savePost = this.savePost.bind(this);
		this.discardPost = this.discardPost.bind(this);
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

	keyUp(event) {
		const e = event;
		console.log(e.target.textContent.length)
		this.setState({ displayPlaceholder: !e.target.textContent.length });
	}

	savePost() {

	}

	discardPost() {

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
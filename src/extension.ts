'use strict';

import { languages, DocumentSelector, ExtensionContext } from 'vscode';
import HoverProvider from './providers/hoverProvider';
import DocumentLinkProvider from './providers/documentLinkProvider';

export function activate(context: ExtensionContext) {
	console.log('Livewire goto activated!');

	const docSelector: DocumentSelector = ['php', 'blade'];

	const linkProvider = languages.registerDocumentLinkProvider(docSelector, new DocumentLinkProvider());

	const hoverProvider = languages.registerHoverProvider(docSelector, new HoverProvider());

	context.subscriptions.push(linkProvider, hoverProvider);
}

export function deactivate() {}

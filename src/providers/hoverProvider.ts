'use strict';

import { Hover, HoverProvider as vsHoverProvider, MarkdownString, Position, ProviderResult, TextDocument, workspace } from 'vscode';
import * as util from '../util';
import DocumentLinkProvider from './documentLinkProvider';

export default class HoverProvider implements vsHoverProvider {
	provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
		let ranges = document.getWordRangeAtPosition(position, util.regexJumpFile);

		if (!ranges) return;

		const wsPath = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

		if (!wsPath) return;

		// const cacheMap = util.getLivewireCacheMap(wsPath);

		const text = document.getText(ranges);
		const matches = text.matchAll(util.regexJumpFile);

		for (const match of matches) {
			const matchedPath = match[3];
            
			const jumpComponentPath = util.convertToComponentFilePath(wsPath, matchedPath);
			const jumpComponentPathShow = jumpComponentPath.replace(wsPath + '/', '');

			const jumpViewPath = util.convertToViewFilePath(wsPath, matchedPath);
			const jumpViewPathShow = jumpViewPath.replace(wsPath + '/', '');

			const markdown = [`\`class:\` [${jumpComponentPathShow}](${jumpComponentPath}) \n`, `\`blade:\` [${jumpViewPathShow}](${jumpViewPath}) \n`].join(' ');

			return new Hover(new MarkdownString(markdown));
		}
	}
}

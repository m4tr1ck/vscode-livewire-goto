'use strict';

import {
    DocumentLink, DocumentLinkProvider as vsDocumentLinkProvider, Position, ProviderResult, Range, TextDocument, Uri, workspace
} from 'vscode';
import * as util from '../util';

export default class DocumentLinkProvider implements vsDocumentLinkProvider {
    provideDocumentLinks(document: TextDocument): ProviderResult<DocumentLink[]> {
        let res: (arg0: DocumentLink[]) => void; 
        let rej;
        let promiseDocumentLinks = new Promise<typeof documentLinks>((_res,_rej)=>{
            ;[res,rej]=[_res,_rej];
        });

        let documentLinks: DocumentLink[] = [];

        const wsPath = workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;

        if (!wsPath) return;

        // const cacheMap = util.getLivewireCacheMap(wsPath);
        for (let index = 0; index < document.lineCount; index++) {
            const line = document.lineAt(index);
            const matches = line.text.matchAll(util.regexJumpFile);

            for (const match of matches) {
                const matchedPath = match[3];

                const startColumn = new Position(
                    line.lineNumber,
                    line.text.indexOf(matchedPath)
                );
                const endColumn = startColumn.translate(0, matchedPath.length);

                const jumpComponentPath = util.convertToComponentFilePath(wsPath, matchedPath);
                
                workspace.findFiles(jumpComponentPath).then((foundComponents) => {
                    if (foundComponents?.length) {
                        documentLinks.push(new DocumentLink(new Range(startColumn, endColumn), Uri.file(jumpComponentPath)));
                    } else {
                        const jumpViewPath = util.convertToViewFilePath(wsPath, matchedPath);
                        documentLinks.push(new DocumentLink(new Range(startColumn, endColumn), Uri.file(jumpViewPath)));
                    }

                    res(documentLinks);
                    return;
                });
                

            }
        }

        return promiseDocumentLinks;
    }
}

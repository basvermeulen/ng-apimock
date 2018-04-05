import * as glob from 'glob';
import * as fs from 'fs-extra';
import * as path from 'path';
import Mock from './mock';
import {Observable} from 'rxjs/Observable';

const JsonRefs = require('json-refs');
const sha1 = require('sha1');

/** Registry represents a group of phases grouped under one name. */
class Processor {
    // the current working directory for this plugin
    static PCWD: string = path.resolve(__dirname, '..');
    // the node_modules directory for this plugin
    static PNMD: string = path.join(Processor.PCWD, 'node_modules');
    // the templates directory for this plugin
    static PTD: string = path.join(Processor.PCWD, 'templates');
    // the templates interface directory for this plugin
    static PTID = path.join(Processor.PTD, 'interface');

    /**
     * Processes all the mocks that are present in the given directory.
     * @param {string} directory The directory containing the mocks.
     * @returns {Mock[]} mocks The mocks.
     */
    processMocks(directory: string): Observable<Mock[]> {
        return new Observable<Mock[]>((observer) => {
            Promise.all(
                glob.sync('**/*.mock.json', {
                    cwd: directory,
                    root: '/'
                }).map((file) => {
                    const filePath = path.join(directory, file);
                    return this.processMock(filePath);
                })
            ).then((mocks: Mock[]) => {
                observer.next(mocks);
                observer.complete();
            });
        });
    }

    processMock(filePath: string): Promise<Mock> {
        // Resolve reference
        const mock = fs.readJsonSync(filePath);
        return JsonRefs.resolveRefs(mock).then((mock: Mock) => {
            const hash = sha1(JSON.stringify(mock));
            mock.identifier = hash;
            return mock;
        });
    }

    /**
     * Generates the protractor.mock.js file in the given output directory.
     * @param {string} directory The output directory
     */
    generateProtractorMock(directory: string): void {
        console.log(path.join(Processor.PTD, 'protractor.mock.js'));
        fs.copySync(path.join(Processor.PTD, 'protractor.mock.js'), path.join(directory, 'protractor.mock.js'));
        fs.copySync(path.join(Processor.PTD, 'protractor.mock.d.ts'), path.join(directory, 'protractor.mock.d.ts'));
    }

    /**
     * Generate the mocking interface.
     * There can be an angular version difference between the application and ng-apimock.
     * Therefor ng-apimock should always use its own version.
     *
     * @param {string} directory The output directory.
     *
     * #1 copy the interface to the output directory
     * #2 copy the dependencies to the output directory
     */
    generateMockingInterface(directory: string): void {
        /** Check if the plugin has a different version of angular as the application. */
        const anmd = !fs.existsSync(path.join(Processor.PNMD, 'angular')) ?
            path.join(process.cwd(), 'node_modules') :
            Processor.PNMD,
            arnmd = !fs.existsSync(path.join(Processor.PNMD, 'angular-resource')) ?
                path.join(process.cwd(), 'node_modules') :
                Processor.PNMD,
            angularJs = path.join(anmd, 'angular', 'angular.min.js'),
            angularResource = path.join(arnmd, 'angular-resource', 'angular-resource.min.js');

        // copy the interface files
        console.log(Processor.PTID);
        glob.sync('**/*', {cwd: Processor.PTID, root: '/'}).forEach((file) =>
            fs.copySync(path.join(Processor.PTID, file), path.join(directory, file)));

        fs.copySync(angularJs, path.join(directory, 'js', 'angular.min.js'));
        fs.copySync(angularResource, path.join(directory, 'js', 'angular-resource.min.js'));
    }
}

export default Processor;

'use strict';

var
	path = require('path');

var
	env = require('../env'),
	cli = require('../../../cli-logger');

module.exports = {
	name: 'init',
	help: 'Initialize a new or existing Enyo project to generate required files and ensure dependencies.',
	options: {
		project: {
			position: 1,
			help: 'The relative path to the project to initialize. Defaults to the current working directory. ' +
				'If the project directory does not exist it will be created.'
		},
		name: {
			help: 'This is the name of the project for the project-level configuration. If not provided and a ' +
				'package.json exists then it will use its "name" value. If not provided and neither ' +
				'a package.json or project-level configuration exists it will default to using the ' +
				'directory name.'
		},
		title: {
			help: 'This is the title that will be applied to the project-level configuration and ' +
				'ultimately used when packaging (if the project is not a library).'
		},
		package: {
			flag: true,
			default: true,
			help: 'By default this will initialize a package.json file. If this is not desired ' +
				'set this to false with --no-package.'
		},
		config: {
			flag: true,
			default: true,
			help: 'By default this will initialize a .enyoconfig file. If this is not desired ' +
				'set this to false with --no-config.'
		},
		gitIgnore: {
			full: 'git-ignore',
			flag: true,
			default: true,
			help: 'By default this will initialize or update a .gitignore file. If this is not desired ' +
				'set this to false with --no-git-ignore.'
		},
		dependencies: {
			full: 'dependencies',
			flag: true,
			default: true,
			help: 'To initialize the repository but without initializing any dependencies set this ' +
				'flag to false with --no-dependencies.'
		},
		libraries: {
			abbr: 'L',
			help: 'Only initialize this comma-separated list of library names. If the --save option ' +
				'is set will save this value as the project\'s only libraries.',
			transform: function (list) {
				return list.trim().split(',');
			}
		},
		links: {
			help: 'A comma-separated list of specific libraries to install as a linked library. If ' +
				'provided, these links will be merged with any existing directives from the configuration ' +
				'unless the --save flag is set in which case it will replace any existing values ' +
				'and be stored. If a link is specified but already exists and is not a link it will ' +
				'be replaced by the link - LOCAL CHANGES WILL BE LOST AND ARE UNRECOVERABLE. To avoid ' +
				'this behavior, use the --safe flag.',
			transform: function (list) {
				return list.trim().split(',');
			}
		},
		linkAllLibs: {
			full: 'link-all-libs',
			help: 'Set this to link from the linkable libraries instead of installing a local ' +
				'repository for each. If a library already exists and is not a link it will be ' +
				'replaced by the link - LOCAL CHANGES WILL BE LOST AND ARE UNRECOVERABLE. To avoid ' +
				'this behavior, use the --safe flag. If the --save flag is set, this option will ' +
				'be set to true in the project-level configuration.',
			flag: true
		},
		save: {
			flag: true,
			default: false,
			help: 'Set this flag to save specified options for the libraries, links and link-all-libs ' +
				'command options.'
		},
		safe: {
			flag: true,
			default: false,
			help: 'Set this flag to ensure that links for existing directories will not replace ' +
				'the existing library and potentially lose local changes.'
		}
	},
	callback: function (opts) {
		opts.project = path.resolve(opts.project || process.cwd());
		opts.cwd = opts.project;
		env(opts).then(require('../init')).then(function (results) {
			if (results) {
				results.forEach(function (result) {
					if (result.isRejected()) {
						cli(result.reason().message);
					}
				});
			}
		});
	}
};
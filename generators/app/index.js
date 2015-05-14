'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

var slug = require('slug');

module.exports = yeoman.generators.Base.extend({
  prompting: function () {
    var done = this.async();


    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the beautiful ' + chalk.red('Wordpress Ionic') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'Please choose a name for your project',
      default: 'My Blog'
    }, {
      type: 'input',
      name: 'projectURL',
      message: 'What is your Wordpress URL?',
      default: 'http://blog.irontec.com'
    }, {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: 'Testing App'
    },{
      type: 'list',
      name: 'language',
      message: 'Language:',
      choices: ['es', 'eu', 'en'],
      default: 0
    }, {
      type: 'input',
      name: 'mainColor',
      message: 'What will be your application main color?',
      default: '#A0251F'
    }, {
      type: 'input',
      name: 'accentColor',
      message: 'What will be your application accent color?',
      default: '#000'
    }];

    this.prompt(prompts, function (props) {
      this.props = props;

      this.props.slugProjectName = slug(this.props.projectName, { lower: true});
      this.props.packageName = 'com.' + slug(this.props.projectName, {lower: true, replacement: '.'});
      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function () {

      // Sass
      this.fs.copyTpl(
        this.templatePath('scss/ionic.app.scss'),
        this.destinationPath('scss/ionic.app.scss'),
        { mainColor: this.props.mainColor, accentColor: this.props.accentColor }
      );

      // www

      // index.html
      this.fs.copyTpl(
        this.templatePath('www/index.html'),
        this.destinationPath('www/index.html'),
        { title: this.props.projectName }
      );

      /// Images
      this.directory('www/img');

      /// Templates
      this.directory('www/templates');

      /// JS
      this.directory('www/js/controllers');
      this.directory('www/js/lang');

      this.fs.copyTpl(
        this.templatePath('www/js/app.js'),
        this.destinationPath('www/js/app.js'),
        { name: this.props.projectName, description: this.props.description, url: this.props.projectURL, language: this.props.language }
      );


    },
    others: function() {
      this.directory('hooks');
    },
    projectfiles: function () {


      // package.json
      this.fs.copyTpl(
        this.templatePath('system/_package.json'),
        this.destinationPath('package.json'),
        { name: this.props.slugProjectName, description: this.props.description}
      );

      // bower.json
      this.fs.copyTpl(
        this.templatePath('system/_bower.json'),
        this.destinationPath('bower.json'),
        { name: this.props.slugProjectName, description: this.props.description}
      );

      // ionic.project
      this.fs.copyTpl(
        this.templatePath('system/ionic.project'),
        this.destinationPath('ionic.project'),
        { name: this.props.slugProjectName}
      );

      // config.xml
      this.fs.copyTpl(
        this.templatePath('system/config.xml'),
        this.destinationPath('config.xml'),
        { name: this.props.slugProjectName, description: this.props.description, packageName: this.props.packageName}
      );

      // Gulpfile
      this.fs.copy(
        this.templatePath('system/gulpfile.js'),
        this.destinationPath('gulpfile.js')
      );

      this.fs.copy(
        this.templatePath('system/editorconfig'),
        this.destinationPath('.editorconfig')
      );

      this.fs.copy(
        this.templatePath('system/jshintrc'),
        this.destinationPath('.jshintrc')
      );

      this.fs.copy(
        this.templatePath('system/gitignore'),
        this.destinationPath('.gitignore')
      );

      this.fs.copy(
        this.templatePath('system/bowerrc'),
        this.destinationPath('.bowerrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});

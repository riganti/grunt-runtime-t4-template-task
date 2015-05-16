# grunt-runtime-t4-template-task

> Generates C# class from T4 Runtime Text Template.
This generator was created because it's not possible to use the built-in Runtime Text Templates in .NET Core. They have dependencies on System.CodeDom which is not available in .NET Core.
This generator creates a pure C# class with TransformText method. 
Only C# language is supported.
 

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-runtime-t4-template-task --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-runtime-t4-template-task');
```

## The "runtime_t4_template_task" task

### Overview
In your project's Gruntfile, add a section named `runtime_t4_template_task` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  runtime_t4_template_task: {
    options: {
      // there are no configuration options yet
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Usage Examples

#### Default Options
Provided you want to generate code from Runtime T4 Template named "OutputTemplate.tt", the syntax looks like this. 
You need to specify the target namespace and class name that will be generated.
The class will have `TransformText` method which can be called at runtime.

```js
grunt.initConfig({
  runtime_t4_template_task: {
    options: {},
    files: {
      "OutputTemplate.cs": { path: "OutputTemplate.tt", namespace: "MyApp", className: "OutputTemplate" }
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

/*
 * grunt-runtime-t4-template-task
 * https://github.com/riganti/grunt-runtime-t4-template-task
 *
 * Copyright (c) 2015 Tomáš Herceg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('runtime_t4_template_task', 'Generates C# class from T4 template to be used at runtime.', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });
    
    // Generate the template code
    function generateRuntimeTemplateCode(source, namespace, className) {

      function getUsings(source, usings) {
        var directiveStartIndex;
        while ((directiveStartIndex = source.indexOf("<#@")) >= 0) {
          if (!source.substring(0, directiveStartIndex).match(/^\s*$/)) {
            throw "Text is not allowed in the <#@ ... #> section!";
          }
        
          // parse the directive
          var directiveEndIndex = source.indexOf("#>", directiveStartIndex);
          var directive = source.substring(directiveStartIndex + 3, directiveEndIndex);
          source = source.substring(directiveEndIndex + 2);
        
          // detect imports
          var directiveMatch = directive.match(/^\s*import\s+namespace\s*=\s*"([^"]+)"\s*/);
          if (directiveMatch) {
            usings.push(directiveMatch[1]);
          }
        }
        return source;
      }

      function generateTransformCode(source, declarations) {
        var sectionStartIndex;
        var output = "";
        while ((sectionStartIndex = source.indexOf("<#")) >= 0) {
          var sectionEndIndex = source.indexOf("#>", sectionStartIndex);
          
          if (sectionStartIndex > 0) {
            output += '__sb.Append(@"' + source.substring(0, sectionStartIndex).replace(/"/g, '""') + '");' + "\r\n";
          }
          
          if (source.indexOf("<#+") === sectionStartIndex) {
            // declaration
            declarations.push(source.substring(sectionStartIndex + 3, sectionEndIndex));
          } else if (source.indexOf("<#=") === sectionStartIndex) {
            // expression
            output += '__sb.Append(' + source.substring(sectionStartIndex + 3, sectionEndIndex) + ');' + "\r\n";
          } else {
            // code block
            output += source.substring(sectionStartIndex + 2, sectionEndIndex);
          }
          source = source.substring(sectionEndIndex + 2);
        }
        
        if (source.length > 0) {
          output += '__sb.Append(@"' + source.replace(/"/g, '""') + '");' + "\r\n";
        }
        
        return output;
      }
      
      // process directives
      var usings = [];
      source = getUsings(source, usings);

      // process code sections
      var declarations = [];
      var transformCode = generateTransformCode(source, declarations);

      // generate the class
      var result = "";
      for (var i = 0; i < usings.length; i++) {
        result += "using " + usings[i] + ";\r\n";
      }
      result += "\r\n";
      result += "namespace " + namespace + "\r\n";
      result += "{\r\n";
      result += "    public class " + className + "\r\n";
      result += "    {\r\n";
      for (var i = 0; i < declarations.length; i++) {
        result += declarations[i] + "\r\n";
      }
      result += "        public string TransformText()\r\n";
      result += "        {\r\n";
      result += "            var __sb = new System.Text.StringBuilder();\r\n";
      result += transformCode + "\r\n";
      result += "            return __sb.ToString();\r\n";
      result += "        }\r\n";
      result += "    }\r\n";
      result += "}\r\n";
      
      return result;
    }    

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {
      // Warn on and remove invalid source files (if nonull was set).
      var src = f.orig.src[0];
      if (!grunt.file.exists(src.path)) {
        grunt.log.warn('Source file "' + src.path + '" not found.');
      }
      
      // Read file source.
      var fileSource = grunt.file.read(src.path);
      
      // Generate destination file
      var output = generateRuntimeTemplateCode(fileSource, src.namespace, src.className);
      grunt.file.write(f.dest, output);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};

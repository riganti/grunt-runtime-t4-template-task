using System;
using System.Linq;
using System.Collections.Concurrent;

namespace MyNamespace
{
    public class Template
    {

public List<int> Items { get; set; }
public string Template { get; set; }

        private System.Text.StringBuilder __sb;

        private void Write(string text) {
            __sb.Append(text);
        }

        private void WriteLine(string text) {
            __sb.AppendLine(text);
        }

        public string TransformText()
        {
            __sb = new System.Text.StringBuilder();
__sb.Append(@" 

This is a ");
__sb.Append( Template );
__sb.Append(@"

");
 for (var i in Items) { __sb.Append(@"
   item ");
__sb.Append( i );
__sb.Append(@"
");
 } __sb.Append(@"

");
__sb.Append(@"
");

            return __sb.ToString();
        }
    }
}

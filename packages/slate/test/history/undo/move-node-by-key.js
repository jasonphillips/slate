/** @jsx h */

import h from '../../helpers/h'

export default function(editor) {
  editor.moveNodeByKey('d', 'a', 1)
  editor.flush().undo()
}

export const input = (
  <value>
    <document key="x">
      <paragraph key="a">
      <paragraph key="b">one</paragraph>
      <paragraph key="c">two</paragraph>
      <paragraph key="d">three</paragraph>
      <paragraph key="e">four</paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = input

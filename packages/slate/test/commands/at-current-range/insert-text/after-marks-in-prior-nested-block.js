/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <b>word</b>
        </paragraph>
        <paragraph>
          <cursor />
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <b>word</b>
        </paragraph>
        <paragraph>
          a<cursor />
        </paragraph>
      </paragraph>
    </document>
  </value>
)

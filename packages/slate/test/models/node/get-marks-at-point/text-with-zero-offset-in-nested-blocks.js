/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'

export const input = (
  <value>
    <document>
      <paragraph>
        <paragraph>
          <b>Bold above</b>
        </paragraph>
        <paragraph>
          <cursor />text
        </paragraph>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getInsertMarksAtPoint(selection.start)
}

export const output = Set.of()

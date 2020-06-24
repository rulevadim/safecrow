import { storiesOf } from '@storybook/vue';

import MyTable from './my-table';

export const tableNamedSlots = `
    <template v-slot:caption>
        Named slot: caption
    </template>
    <template v-slot:thead>
        <tr>
            <th>
                thead slot: First column name
            </th>
            <th>
                thead slot: Second column name
            </th>
        </tr>
    </template>
    <template v-slot:tbody>
        <tr>
            <td>
                tbody slot: First column value
            </td>
            <td>
                tbody slot: Second column value
            </td>
        </tr>
    </template>
    <template v-slot:tfoot>
        <tr>
            <td>
                tfoot slot: First column value
            </td>
            <td>
                tfoot slot: Second column value
            </td>
        </tr>
    </template>
`;
export const tableDefaultSlot = `
    <caption>
        Custom caption
    </caption>
    <thead>
        <tr>
            <th>Custom thead</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Custom tbody</th>
        </tr>
    </tbody>
    <tr>
        <td>
            Default slot (without wrapper)
        </td>
    </tr>
    <tfoot>
        <tr>
            <th>Custom tfoot</th>
        </tr>
    </tfoot>
`;

storiesOf('MyTable', module)
  .add('with named slots', () => {
    return {
      components: { MyTable },
      template: `<my-table>${tableNamedSlots}</my-table>`,
    };
  })
  .add('with default slot', () => {
    return {
      components: { MyTable },
      template: `<my-table>${tableDefaultSlot}</my-table>`,
    };
  });

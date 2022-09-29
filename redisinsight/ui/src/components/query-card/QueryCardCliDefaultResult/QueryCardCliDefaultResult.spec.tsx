import React from 'react'
import { instance, mock } from 'ts-mockito'
import { render } from 'uiSrc/utils/test-utils'
import QueryCardCliDefaultResult, { Props } from './QueryCardCliDefaultResult'

const mockedProps = mock<Props>()

/**
 * QueryCardCliDefaultResult tests
 *
 * @group unit
 */
describe('QueryCardCliDefaultResult', () => {
  it('should render', () => {
    expect(render(<QueryCardCliDefaultResult {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('Result element should render (nil) result', () => {
    const mockResult = [{
      response: '',
      status: 'success'
    }]

    const { queryByTestId } = render(
      <QueryCardCliDefaultResult {...instance(mockedProps)} result={mockResult} />
    )

    const resultEl = queryByTestId('query-cli-group-result')

    expect(resultEl).toHaveTextContent('(nil)')
  })
})

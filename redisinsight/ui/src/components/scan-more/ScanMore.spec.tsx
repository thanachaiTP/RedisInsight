import React from 'react'
import { instance, mock } from 'ts-mockito'
import { fireEvent, screen, render } from 'uiSrc/utils/test-utils'
import ScanMore, { Props } from './ScanMore'

const mockedProps = mock<Props>()

/**
 * ActionBar tests
 *
 * @group unit
 */
describe('ActionBar', () => {
  it('should render', () => {
    expect(render(<ScanMore {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('should call "loadMoreItems"', () => {
    const handleClick = jest.fn()

    const renderer = render(
      <ScanMore {...instance(mockedProps)} loadMoreItems={handleClick} totalItemsCount={1} />
    )

    expect(renderer).toBeTruthy()

    fireEvent.click(screen.getByTestId('scan-more'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should button be hidden when totalItemsCount < scanned ', () => {
    const { queryByTestId } = render(
      <ScanMore {...instance(mockedProps)} scanned={2} totalItemsCount={1} />
    )

    expect(queryByTestId('scan-more')).not.toBeInTheDocument()
  })
  it('should button be shown when totalItemsCount > scanned ', () => {
    const { queryByTestId } = render(
      <ScanMore {...instance(mockedProps)} scanned={1} totalItemsCount={2} />
    )

    expect(queryByTestId('scan-more')).toBeInTheDocument()
  })
})

import React from 'react'
import { cloneDeep } from 'lodash'
import { useSelector } from 'react-redux'
import { instance, mock } from 'ts-mockito'
import { getDBAnalysis } from 'uiSrc/slices/analytics/dbAnalysis'
import { RootState } from 'uiSrc/slices/store'
import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import { INSTANCE_ID_MOCK } from 'uiSrc/mocks/handlers/analytics/clusterDetailsHandlers'

import {
  act,
  cleanup,
  mockedStore,
  fireEvent,
  render,
  screen,
  waitForEuiToolTipVisible,
} from 'uiSrc/utils/test-utils'

import Header, { Props } from './Header'

const mockedProps = mock<Props>()

const mockReports = [
  { id: 'id_1', createdAt: '2022-09-23T05:30:23.000Z' },
  { id: 'id_2', createdAt: '2022-09-23T05:15:19.000Z' }
]

const mockProgress = {
  total: 10,
  scanned: 10,
  processed: 10
}

let store: typeof mockedStore

beforeEach(() => {
  cleanup()
  store = cloneDeep(mockedStore)
  store.clearActions()
})

jest.mock('uiSrc/telemetry', () => ({
  ...jest.requireActual('uiSrc/telemetry'),
  sendEventTelemetry: jest.fn(),
}))

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

const connectType = (state: any, connectionType: any) => {
  (useSelector as jest.Mock).mockImplementation((callback: (arg0: RootState) => RootState) => callback({
    ...state,
    connections: {
      ...state.connections,
      instances: {
        ...state.connections.instances,
        connectedInstance: {
          ...state.connections.instances.connectedInstance,
          connectionType,
        }
      }
    },
  }))
}

describe('DatabaseAnalysisHeader', () => {
  beforeEach(() => {
    const state: any = store.getState()
    connectType(state, 'STANDALONE')
  })

  it('should render', () => {
    expect(render(<Header {...instance(mockedProps)} />)).toBeTruthy()
  })

  it('should not render progress', () => {
    const { queryByTestId } = render(<Header {...instance(mockedProps)} items={mockReports} progress={undefined} />)

    expect(queryByTestId('analysis-progress')).not.toBeInTheDocument()
  })

  it('should render progress', () => {
    render(<Header {...instance(mockedProps)} items={mockReports} progress={mockProgress} />)

    expect(screen.getByTestId('analysis-progress')).toBeInTheDocument()
  })
  it('should call "getDBAnalysis" action be called after click "start-database-analysis-btn"', () => {
    render(<Header {...instance(mockedProps)} />)
    fireEvent.click(screen.getByTestId('start-database-analysis-btn'))

    const expectedActions = [getDBAnalysis()]
    expect(store.getActions()).toEqual(expectedActions)
  })
  it('should send telemetry event after click "new analysis" btn', async () => {
    const sendEventTelemetryMock = jest.fn()

    sendEventTelemetry.mockImplementation(() => sendEventTelemetryMock)

    render(<Header {...instance(mockedProps)} />)

    fireEvent.click(screen.getByTestId('start-database-analysis-btn'))

    expect(sendEventTelemetry).toBeCalledWith({
      event: TelemetryEvent.DATABASE_ANALYSIS_STARTED,
      eventData: {
        databaseId: INSTANCE_ID_MOCK,
      }
    })

    sendEventTelemetry.mockRestore()
  })

  it.skip('should call onChangeSelectedAnalysis after change selector', async () => {
    const onChangeSelectedAnalysis = jest.fn()

    const { queryByText } = render(
      <Header
        {...instance(mockedProps)}
        onChangeSelectedAnalysis={onChangeSelectedAnalysis}
        items={mockReports}
        progress={mockProgress}
      />
    )

    fireEvent.click(screen.getByTestId('select-report'))
    fireEvent.click(queryByText('23 Sep 2022 05:30') || document)

    expect(onChangeSelectedAnalysis).toBeCalled()
  })
})

describe('CLUSTER db', () => {
  beforeEach(() => {
    const state: any = store.getState()
    connectType(state, 'CLUSTER')
  })

  it('should render cluster tooltip message', async () => {
    render(<Header {...instance(mockedProps)} />)

    await act(async () => {
      fireEvent.mouseOver(screen.getByTestId('db-new-reports-icon'))
    })
    await waitForEuiToolTipVisible()

    expect(screen.getByTestId('db-new-reports-tooltip')).toHaveTextContent('Analyze up to 10 000 keys per shard to get an overview of your data.')
  })
})

describe('STANDALONE db', () => {
  beforeEach(() => {
    const state: any = store.getState()
    connectType(state, 'STANDALONE')
  })

  it('should render default tooltip message', async () => {
    render(<Header {...instance(mockedProps)} />)

    await act(async () => {
      fireEvent.mouseOver(screen.getByTestId('db-new-reports-icon'))
    })
    await waitForEuiToolTipVisible()

    expect(screen.getByTestId('db-new-reports-tooltip')).toHaveTextContent('Database AnalysisAnalyze up to 10 000 keys per Redis database to get an overview of your data.')
  })
})

describe('SENTINEL db', () => {
  beforeEach(() => {
    const state: any = store.getState()
    connectType(state, 'SENTINEL')
  })

  it('should render default tooltip message', async () => {
    render(<Header {...instance(mockedProps)} />)

    await act(async () => {
      fireEvent.mouseOver(screen.getByTestId('db-new-reports-icon'))
    })
    await waitForEuiToolTipVisible()

    expect(screen.getByTestId('db-new-reports-tooltip')).toHaveTextContent('Database AnalysisAnalyze up to 10 000 keys per Redis database to get an overview of your data.')
  })
})

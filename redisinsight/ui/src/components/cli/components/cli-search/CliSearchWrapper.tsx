import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { sendEventTelemetry, TelemetryEvent } from 'uiSrc/telemetry'
import {
  clearSearchingCommand,
  setSearchingCommand,
  setSearchingCommandFilter,
  setCliEnteringCommand
} from 'uiSrc/slices/cli/cli-settings'
import { appRedisCommandsSelector } from 'uiSrc/slices/app/redis-commands'

import CliSearchInput from './CliSearchInput'
import CliSearchFilter from './CliSearchFilter'

import styles from './styles.module.scss'

const CliSearchWrapper = () => {
  const { instanceId = '' } = useParams<{ instanceId: string }>()
  const [filterType, setFilterType] = useState<string>('')
  const [searchValue, setSearchValue] = useState<string>('')
  const { loading } = useSelector(appRedisCommandsSelector)
  const dispatch = useDispatch()

  useEffect(() => () => {
    dispatch(clearSearchingCommand())
    dispatch(setCliEnteringCommand())
  }, [])

  const onChangeSearch = (value: string) => {
    setSearchValue(value)

    if (value === '' && !filterType) {
      dispatch(clearSearchingCommand())
      dispatch(setCliEnteringCommand())
      return
    }
    dispatch(setSearchingCommand(value))
  }

  const onChangeFilter = (type: string) => {
    setFilterType(type)

    if (type) {
      sendEventTelemetry({
        event: TelemetryEvent.COMMAND_HELPER_COMMAND_FILTERED,
        eventData: {
          databaseId: instanceId,
          group: type
        }
      })
    }

    if (searchValue === '' && !type) {
      dispatch(clearSearchingCommand())
      dispatch(setCliEnteringCommand())
      return
    }
    dispatch(setSearchingCommandFilter(type))
  }

  return (
    <div className={styles.searchWrapper}>
      <CliSearchFilter isLoading={loading} submitFilter={onChangeFilter} />
      <CliSearchInput isLoading={loading} submitSearch={onChangeSearch} />
    </div>
  )
}

export default CliSearchWrapper

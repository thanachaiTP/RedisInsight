import React, { ReactElement } from 'react'
import { EuiLink, EuiText, EuiTextColor } from '@elastic/eui'
import { CommandGroup } from 'uiSrc/constants'
import { getDocUrlForCommand } from 'uiSrc/utils'

import CliCommandInfo from '../../cli-command-info'
import CliSearchWrapper from '../../cli-search'
import CliSearchOutput from '../../cli-search-output'
import styles from './styles.module.scss'

export interface Props {
  commandLine: string;
  isSearching: boolean;
  searchedCommands: string[];
  argString: string;
  argList: ReactElement[];
  summary: string;
  group: CommandGroup | string;
  complexity: string;
  complexityShort: string;
  since: string;
}

const CliHelper = (props: Props) => {
  const {
    commandLine = '',
    isSearching = false,
    searchedCommands = [],
    argString = '',
    argList = [],
    summary = '',
    group = CommandGroup.Generic,
    complexity = '',
    complexityShort = '',
    since = '',
  } = props

  const readMore = (commandName = '') => {
    const docUrl = getDocUrlForCommand(commandName, group)
    return (
      <EuiLink
        color="subdued"
        href={docUrl}
        className={styles.link}
        external={false}
        target="_blank"
        data-testid="read-more"
      >
        Read more
      </EuiLink>
    )
  }

  return (
    <div className={styles.container} data-testid="cli-helper">
      <div className={styles.searchWrapper}>
        <CliSearchWrapper />
      </div>
      <div className={styles.outputWrapper}>
        {isSearching && (
          <CliSearchOutput searchedCommands={searchedCommands} />
        )}
        {!isSearching && (
          <>
            {commandLine && (
              <div style={{ width: '100%' }}>
                <CliCommandInfo args={argString} group={group} complexity={complexityShort} />
                {summary && (
                  <EuiText className={styles.summary} color="subdued" data-testid="cli-helper-summary">
                    <span style={{ paddingRight: 5 }}>{summary}</span>
                    {' '}
                    {readMore(commandLine)}
                  </EuiText>
                )}
                {!!argList.length && (
                  <div className={styles.field} data-testid="cli-helper-arguments">
                    <EuiText color="subdued" className={styles.fieldTitle}>
                      Arguments:
                    </EuiText>
                    {argList}
                  </div>
                )}
                {since && (
                  <div className={styles.field} data-testid="cli-helper-since">
                    <EuiText color="subdued" className={styles.fieldTitle}>
                      Since:
                    </EuiText>
                    {since}
                  </div>
                )}
                {!complexityShort && complexity && (
                  <div className={styles.field} data-testid="cli-helper-complexity">
                    <EuiText color="subdued" className={styles.fieldTitle}>
                      Complexity:
                    </EuiText>
                    {complexity}
                  </div>
                )}
              </div>
            )}
            {!commandLine && (
              <EuiTextColor
                color="subdued"
                className={styles.defaultScreen}
                data-testid="cli-helper-default"
              >
                Enter any command in CLI or use search to see detailed information.
              </EuiTextColor>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CliHelper

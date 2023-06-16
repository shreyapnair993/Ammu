import { useSuspenseQuery } from '@suspensive/react-query';
import { useIsFetching } from '@tanstack/react-query';
import cx from 'classnames';
import { capitalize } from 'lodash-es';
import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { IconContext } from 'react-icons';
import { HiArchive, HiDownload, HiOutlineExclamationCircle } from 'react-icons/hi';
import {
  ActionFunctionArgs,
  generatePath,
  useFetcher,
  useSearchParams,
} from 'react-router-dom';
import {
  Badge,
  Breadcrumb,
  BreadcrumbLink,
  Button,
  CircleSpinner,
  Combobox,
  ComboboxOption,
  createColumnHelper,
  Dropdown,
  DropdownItem,
  Modal,
  SortingState,
  Table,
  TableSkeleton,
} from 'ui-components';

import { getScanResultsApiClient } from '@/api/api';
import {
  ModelScanInfo,
  UtilsReportFiltersNodeTypeEnum,
  UtilsReportFiltersScanTypeEnum,
} from '@/api/generated';
import { DFLink } from '@/components/DFLink';
import { FilterBadge } from '@/components/filters/FilterBadge';
import { SearchableClusterList } from '@/components/forms/SearchableClusterList';
import { SearchableContainerList } from '@/components/forms/SearchableContainerList';
import { SearchableHostList } from '@/components/forms/SearchableHostList';
import { SearchableImageList } from '@/components/forms/SearchableImageList';
import { EllipsisIcon } from '@/components/icons/common/Ellipsis';
import { FilterIcon } from '@/components/icons/common/Filter';
import { ScanStatusesIcon } from '@/components/icons/common/ScanStatuses';
import { TimesIcon } from '@/components/icons/common/Times';
import { SecretsIcon } from '@/components/sideNavigation/icons/Secrets';
import { SEVERITY_COLORS } from '@/constants/charts';
import { useDownloadScan } from '@/features/common/data-component/downloadScanAction';
import { IconMapForNodeType } from '@/features/onboard/components/IconMapForNodeType';
import { SuccessModalContent } from '@/features/settings/components/SuccessModalContent';
import { queries } from '@/queries';
import { ScanTypeEnum } from '@/types/common';
import { apiWrapper } from '@/utils/api';
import { formatMilliseconds } from '@/utils/date';
import { isScanComplete } from '@/utils/scan';
import { getOrderFromSearchParams, useSortingState } from '@/utils/table';
import { usePageNavigation } from '@/utils/usePageNavigation';

export interface FocusableElement {
  focus(options?: FocusOptions): void;
}

enum ActionEnumType {
  DELETE = 'delete',
}

const PAGE_SIZE = 15;

type ScanResult = ModelScanInfo & {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  unknown: number;
};

const action = async ({
  request,
}: ActionFunctionArgs): Promise<
  | {
      url: string;
    }
  | null
  | { success: boolean; message?: string }
> => {
  const formData = await request.formData();
  const actionType = formData.get('actionType');
  const scanId = formData.get('scanId');
  const nodeId = formData.get('nodeId');
  if (!actionType || !scanId || !nodeId) {
    throw new Error('Invalid action');
  }

  if (actionType === ActionEnumType.DELETE) {
    const resultApi = apiWrapper({
      fn: getScanResultsApiClient().deleteScanResultsForScanID,
    });
    const result = await resultApi({
      scanId: scanId.toString(),
      scanType: ScanTypeEnum.SecretScan,
    });
    if (!result.ok) {
      if (result.error.response.status === 400 || result.error.response.status === 409) {
        return {
          success: false,
          message: result.error.message ?? '',
        };
      } else if (result.error.response.status === 403) {
        return {
          success: false,
          message: 'You do not have enough permissions to delete scan',
        };
      }
    }

    return {
      success: true,
    };
  }
  return null;
};
const DeleteIcon = () => {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.76001 12.5249C1.76001 18.416 6.53564 23.1916 12.4267 23.1916C15.2557 23.1916 17.9688 22.0678 19.9691 20.0674C21.9695 18.067 23.0933 15.3539 23.0933 12.5249C23.0933 6.6339 18.3177 1.85828 12.4267 1.85828C6.53564 1.85828 1.76001 6.6339 1.76001 12.5249ZM3.09334 12.5249C3.09334 7.37029 7.27202 3.19161 12.4267 3.19161C17.5813 3.19161 21.76 7.37029 21.76 12.5249C21.76 17.6796 17.5813 21.8583 12.4267 21.8583C7.27202 21.8583 3.09334 17.6796 3.09334 12.5249ZM12.4267 15.5983C12.0585 15.5983 11.76 15.2998 11.76 14.9316V6.93161C11.76 6.56342 12.0585 6.26494 12.4267 6.26494C12.7949 6.26494 13.0933 6.56342 13.0933 6.93161V14.9316C13.0933 15.2998 12.7949 15.5983 12.4267 15.5983ZM13.3133 17.8983C13.3133 18.388 12.9164 18.7849 12.4267 18.7849C11.937 18.7849 11.54 18.388 11.54 17.8983C11.54 17.4086 11.937 17.0116 12.4267 17.0116C12.9164 17.0116 13.3133 17.4086 13.3133 17.8983Z"
        fill="currentColor"
      />
    </svg>
  );
};

const DeleteConfirmationModal = ({
  showDialog,
  scanId,
  nodeId,
  setShowDialog,
}: {
  showDialog: boolean;
  scanId: string;
  nodeId: string;
  setShowDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const fetcher = useFetcher();

  const onDeleteAction = useCallback(
    (actionType: string) => {
      const formData = new FormData();
      formData.append('actionType', actionType);
      formData.append('scanId', scanId);
      formData.append('nodeId', nodeId);
      fetcher.submit(formData, {
        method: 'post',
      });
    },
    [scanId, nodeId, fetcher],
  );

  return (
    <Modal
      open={showDialog}
      onOpenChange={() => setShowDialog(false)}
      size="s"
      title={
        <div className="flex gap-3 items-center dark:text-status-error">
          <DeleteIcon />
          Delete Scan
        </div>
      }
      footer={
        <div className={'flex gap-x-3 justify-end'}>
          <Button
            size="sm"
            onClick={() => setShowDialog(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            color="error"
            onClick={(e) => {
              e.preventDefault();
              onDeleteAction(ActionEnumType.DELETE);
            }}
          >
            DELETE
          </Button>
        </div>
      }
    >
      {!fetcher.data?.success ? (
        <div className="grid">
          Selected scan will be deleted.
          <br />
          <span>Are you sure you want to delete?</span>
          {fetcher.data?.message && <p className="">{fetcher.data?.message}</p>}
          <div className="flex items-center justify-right gap-4"></div>
        </div>
      ) : (
        <SuccessModalContent text="Scan deleted successfully!" />
      )}
    </Modal>
  );
};

const ActionDropdown = ({
  trigger,
  scanId,
  nodeId,
  scanStatus,
  nodeType,
  setShowDeleteDialog,
  setScanIdToDelete,
  setNodeIdToDelete,
}: {
  trigger: React.ReactNode;
  scanId: string;
  nodeId: string;
  scanStatus: string;
  nodeType: string;
  setShowDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setScanIdToDelete: React.Dispatch<React.SetStateAction<string>>;
  setNodeIdToDelete: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const fetcher = useFetcher();
  const [open, setOpen] = useState(false);
  const { downloadScan } = useDownloadScan();

  const onDownloadAction = useCallback(() => {
    downloadScan({
      scanId,
      nodeType: nodeType as UtilsReportFiltersNodeTypeEnum,
      scanType: UtilsReportFiltersScanTypeEnum.Secret,
    });
  }, [scanId, nodeId, fetcher]);

  useEffect(() => {
    if (fetcher.state === 'idle') setOpen(false);
  }, [fetcher]);

  return (
    <Dropdown
      triggerAsChild
      align="end"
      open={open}
      onOpenChange={setOpen}
      content={
        <>
          <DropdownItem
            className="text-sm"
            onClick={(e) => {
              if (!isScanComplete(scanStatus)) return;
              e.preventDefault();
              onDownloadAction();
            }}
          >
            <span
              className={cx('flex items-center gap-x-2', {
                'opacity-60 dark:opacity-30 cursor-default': !isScanComplete(scanStatus),
              })}
            >
              <HiDownload />
              Download Report
            </span>
          </DropdownItem>
          <DropdownItem
            className="text-sm"
            onClick={(e) => {
              if (!isScanComplete(scanStatus)) return;
              e.preventDefault();
              onDownloadAction();
            }}
            disabled
          >
            <span
              className={cx('flex items-center gap-x-2', {
                'opacity-60 dark:opacity-30 cursor-default': !isScanComplete(scanStatus),
              })}
            >
              <HiDownload />
              Start scan
            </span>
          </DropdownItem>
          <DropdownItem
            className="text-sm"
            onClick={() => {
              setScanIdToDelete(scanId);
              setNodeIdToDelete(nodeId);
              setShowDeleteDialog(true);
            }}
          >
            <span className="flex items-center gap-x-2 text-red-700 dark:text-red-400">
              <IconContext.Provider
                value={{ className: 'text-red-700 dark:text-red-400' }}
              >
                <HiArchive />
              </IconContext.Provider>
              Delete
            </span>
          </DropdownItem>
        </>
      }
    >
      {trigger}
    </Dropdown>
  );
};

const FILTER_SEARCHPARAMS: Record<string, string> = {
  nodeType: 'Node Types',
  statuses: 'Statuses',
  containerImages: 'Container images',
  containers: 'containers',
  hosts: 'hosts',
  clusters: 'clusters',
};

const getAppliedFiltersCount = (searchParams: URLSearchParams) => {
  return Object.keys(FILTER_SEARCHPARAMS).reduce((prev, curr) => {
    return prev + searchParams.getAll(curr).length;
  }, 0);
};
const Filters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [nodeType, setNodeType] = useState('');
  const [containerImages, setContainerImages] = useState<string[]>([]);
  const [containers, setContainers] = useState<string[]>([]);
  const [hosts, setHosts] = useState<string[]>([]);
  const [clusters, setClusters] = useState<string[]>([]);
  const [statuses, setStatuses] = useState('');

  const appliedFilterCount = getAppliedFiltersCount(searchParams);
  return (
    <div className="px-4 py-2.5 mb-4 border dark:border-bg-hover-3 rounded-[5px] overflow-hidden dark:bg-bg-left-nav">
      <div className="flex gap-2">
        <Combobox
          getDisplayValue={() => FILTER_SEARCHPARAMS['nodeType']}
          multiple
          value={searchParams.getAll('nodeType')}
          onChange={(values) => {
            setSearchParams((prev) => {
              prev.delete('nodeType');
              values.forEach((value) => {
                prev.append('nodeType', value);
              });
              prev.delete('page');
              return prev;
            });
          }}
          onQueryChange={(query) => {
            setNodeType(query);
          }}
          clearAllElement="Clear"
          onClearAll={() => {
            setSearchParams((prev) => {
              prev.delete('nodeType');
              prev.delete('page');
              return prev;
            });
          }}
        >
          {['host', 'container', 'container_image']
            .filter((item) => {
              if (!nodeType.length) return true;
              return item.includes(nodeType.toLowerCase());
            })
            .map((item) => {
              return (
                <ComboboxOption key={item} value={item}>
                  {capitalize(item)}
                </ComboboxOption>
              );
            })}
        </Combobox>
        <Combobox
          getDisplayValue={() => FILTER_SEARCHPARAMS['statuses']}
          multiple
          value={searchParams.getAll('statuses')}
          onChange={(values) => {
            setSearchParams((prev) => {
              prev.delete('statuses');
              values.forEach((value) => {
                prev.append('statuses', value);
              });
              prev.delete('page');
              return prev;
            });
          }}
          onQueryChange={(query) => {
            setStatuses(query);
          }}
          clearAllElement="Clear"
          onClearAll={() => {
            setSearchParams((prev) => {
              prev.delete('statuses');
              prev.delete('page');
              return prev;
            });
          }}
        >
          {['complete', 'in progress', 'error']
            .filter((item) => {
              if (!statuses.length) return true;
              return item.includes(statuses.toLowerCase());
            })
            .map((item) => {
              return (
                <ComboboxOption key={item} value={item}>
                  {capitalize(item)}
                </ComboboxOption>
              );
            })}
        </Combobox>

        <SearchableImageList
          scanType={ScanTypeEnum.SecretScan}
          defaultSelectedImages={searchParams.getAll('containerImages')}
          onClearAll={() => {
            setContainerImages([]);
            setSearchParams((prev) => {
              prev.delete('containerImages');
              prev.delete('page');
              return prev;
            });
          }}
          onChange={(value) => {
            setContainerImages(value);
            setSearchParams((prev) => {
              prev.delete('containerImages');
              value.forEach((containerImage) => {
                prev.append('containerImages', containerImage);
              });
              prev.delete('page');
              return prev;
            });
          }}
        />
        <SearchableContainerList
          scanType={ScanTypeEnum.SecretScan}
          defaultSelectedContainers={searchParams.getAll('containers')}
          onClearAll={() => {
            setContainers([]);
            setSearchParams((prev) => {
              prev.delete('containers');
              prev.delete('page');
              return prev;
            });
          }}
          onChange={(value) => {
            setContainers(value);
            setSearchParams((prev) => {
              prev.delete('containers');
              value.forEach((container) => {
                prev.append('containers', container);
              });
              prev.delete('page');
              return prev;
            });
          }}
        />
        <SearchableHostList
          scanType={ScanTypeEnum.SecretScan}
          defaultSelectedHosts={searchParams.getAll('hosts')}
          onClearAll={() => {
            setHosts([]);
            setSearchParams((prev) => {
              prev.delete('hosts');
              prev.delete('page');
              return prev;
            });
          }}
          onChange={(value) => {
            setHosts(value);
            setSearchParams((prev) => {
              prev.delete('hosts');
              value.forEach((host) => {
                prev.append('hosts', host);
              });
              prev.delete('page');
              return prev;
            });
          }}
        />
        <SearchableClusterList
          defaultSelectedClusters={searchParams.getAll('clusters')}
          onClearAll={() => {
            setClusters([]);
            setSearchParams((prev) => {
              prev.delete('clusters');
              prev.delete('page');
              return prev;
            });
          }}
          onChange={(value) => {
            setClusters(value);
            setSearchParams((prev) => {
              prev.delete('clusters');
              value.forEach((cluster) => {
                prev.append('clusters', cluster);
              });
              prev.delete('page');
              return prev;
            });
          }}
        />
      </div>
      {appliedFilterCount > 0 ? (
        <div className="flex gap-2.5 mt-4 flex-wrap items-center">
          {Array.from(searchParams)
            .filter(([key]) => {
              return Object.keys(FILTER_SEARCHPARAMS).includes(key);
            })
            .map(([key, value]) => {
              return (
                <FilterBadge
                  key={`${key}-${value}`}
                  onRemove={() => {
                    setSearchParams((prev) => {
                      const existingValues = prev.getAll(key);
                      prev.delete(key);
                      existingValues.forEach((existingValue) => {
                        if (existingValue !== value) prev.append(key, existingValue);
                      });
                      prev.delete('page');
                      return prev;
                    });
                  }}
                  text={`${FILTER_SEARCHPARAMS[key]}: ${value}`}
                />
              );
            })}
          <Button
            variant="flat"
            color="default"
            startIcon={<TimesIcon />}
            onClick={() => {
              setSearchParams((prev) => {
                Object.keys(FILTER_SEARCHPARAMS).forEach((key) => {
                  prev.delete(key);
                });
                prev.delete('page');
                return prev;
              });
            }}
            size="sm"
          >
            Clear all
          </Button>
        </div>
      ) : null}
    </div>
  );
};

const ScansTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data } = useSuspenseQuery({
    ...queries.secret.scanList({
      pageSize: PAGE_SIZE,
      clusters: searchParams.getAll('clusters'),
      containers: searchParams.getAll('containers'),
      hosts: searchParams.getAll('hosts'),
      images: searchParams.getAll('containerImages'),
      nodeTypes: searchParams.getAll('nodeType').length
        ? searchParams.getAll('nodeType')
        : ['container_image', 'container', 'host'],
      page: parseInt(searchParams.get('page') ?? '0', 10),
      order: getOrderFromSearchParams(searchParams),
      status: searchParams.getAll('statuses').map((status) => status.toUpperCase()),
    }),
    keepPreviousData: true,
  });
  const [sort, setSort] = useSortingState();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [scanIdToDelete, setScanIdToDelete] = useState('');
  const [nodeIdToDelete, setNodeIdToDelete] = useState('');

  const columnHelper = createColumnHelper<ScanResult>();

  const { navigate } = usePageNavigation();

  const columns = useMemo(() => {
    const columns = [
      columnHelper.display({
        id: 'actions',
        enableSorting: false,
        cell: (cell) => (
          <ActionDropdown
            scanId={cell.row.original.scan_id}
            nodeId={cell.row.original.node_id}
            nodeType={cell.row.original.node_type}
            scanStatus={cell.row.original.status}
            setScanIdToDelete={setScanIdToDelete}
            setNodeIdToDelete={setNodeIdToDelete}
            setShowDeleteDialog={setShowDeleteDialog}
            trigger={
              <button className="p-1">
                <span className="block h-4 w-4 dark:text-text-text-and-icon rotate-90">
                  <EllipsisIcon />
                </span>
              </button>
            }
          />
        ),
        header: () => '',
        size: 30,
        minSize: 30,
        maxSize: 50,
        enableResizing: false,
      }),
      columnHelper.accessor('node_type', {
        enableSorting: false,
        cell: (info) => {
          return (
            <div className="flex items-center gap-x-2">
              <div className="p-1.5 rounded-lg">
                <IconContext.Provider value={{ className: 'w-4 h-4' }}>
                  {IconMapForNodeType[info.getValue()]}
                </IconContext.Provider>
              </div>
              <span className="flex-1 truncate capitalize">
                {info.getValue()?.replaceAll('_', ' ')}
              </span>
            </div>
          );
        },
        header: () => 'Type',
        minSize: 100,
        size: 120,
        maxSize: 130,
      }),
      columnHelper.accessor('node_name', {
        cell: (info) => {
          const isNeverScan = info.row.original.status?.toLowerCase() === '';
          const WrapperComponent = ({ children }: { children: React.ReactNode }) => {
            return isNeverScan ? (
              <>{children}</>
            ) : (
              <DFLink
                to={generatePath(`/secret/scan-results/:scanId`, {
                  scanId: info.row.original.scan_id,
                })}
              >
                {children}
              </DFLink>
            );
          };
          return (
            <WrapperComponent>
              <div className="flex items-center gap-x-2 truncate">
                <span className="truncate">{info.getValue()}</span>
              </div>
            </WrapperComponent>
          );
        },
        header: () => 'Name',
        minSize: 230,
        size: 240,
        maxSize: 250,
      }),
      columnHelper.accessor('updated_at', {
        cell: (info) => (
          <div className="flex items-center">
            <span className="truncate">{formatMilliseconds(info.getValue())}</span>
          </div>
        ),
        header: () => 'Timestamp',
        minSize: 140,
        size: 140,
        maxSize: 150,
      }),
      columnHelper.accessor('status', {
        enableSorting: true,
        cell: (info) => ScanStatusesIcon(info.getValue()),
        header: () => 'Scan Status',
        minSize: 100,
        size: 110,
        maxSize: 110,
        enableResizing: false,
      }),
      columnHelper.accessor('total', {
        cell: (info) => (
          <div className="flex items-center justify-end tabular-nums">
            <span className="truncate">{info.getValue()}</span>
          </div>
        ),
        header: () => <div className="text-right truncate">Total</div>,
        minSize: 80,
        size: 80,
        maxSize: 80,
      }),
      columnHelper.accessor('critical', {
        cell: (info) => (
          <div className="flex items-center justify-end gap-x-2 tabular-nums">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS['critical'],
              }}
            ></div>
            <DFLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                searchParams.set('severity', 'critical');
                const path = generatePath(
                  `/secret/scan-results/:scanId/?${searchParams.toString()}`,
                  {
                    scanId: info.row.original.scan_id,
                  },
                );
                navigate(path);
              }}
            >
              {info.getValue()}
            </DFLink>
          </div>
        ),
        header: () => 'Critical',
        minSize: 80,
        size: 80,
        maxSize: 80,
        enableResizing: false,
      }),
      columnHelper.accessor('high', {
        cell: (info) => (
          <div className="flex items-center justify-end gap-x-2 tabular-nums">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS['high'],
              }}
            ></div>
            <DFLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                searchParams.set('severity', 'high');
                const path = generatePath(
                  `/secret/scan-results/:scanId/?${searchParams.toString()}`,
                  {
                    scanId: info.row.original.scan_id,
                  },
                );
                navigate(path);
              }}
            >
              {info.getValue()}
            </DFLink>
          </div>
        ),
        header: () => 'High',
        minSize: 80,
        size: 80,
        maxSize: 80,
        enableResizing: false,
      }),
      columnHelper.accessor('medium', {
        cell: (info) => (
          <div className="flex items-center justify-end gap-x-2 tabular-nums">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS['medium'],
              }}
            ></div>
            <DFLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                searchParams.set('severity', 'medium');
                const path = generatePath(
                  `/secret/scan-results/:scanId/?${searchParams.toString()}`,
                  {
                    scanId: info.row.original.scan_id,
                  },
                );
                navigate(path);
              }}
            >
              {info.getValue()}
            </DFLink>
          </div>
        ),
        header: () => 'Medium',
        minSize: 80,
        size: 80,
        maxSize: 80,
        enableResizing: false,
      }),
      columnHelper.accessor('low', {
        cell: (info) => (
          <div className="flex items-center justify-end gap-x-2 tabular-nums">
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS['low'],
              }}
            ></div>
            <DFLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                searchParams.set('severity', 'low');
                const path = generatePath(
                  `/secret/scan-results/:scanId/?${searchParams.toString()}`,
                  {
                    scanId: info.row.original.scan_id,
                  },
                );
                navigate(path);
              }}
            >
              {info.getValue()}
            </DFLink>
          </div>
        ),
        header: () => 'Low',
        minSize: 80,
        size: 80,
        maxSize: 80,
        enableResizing: false,
      }),
      columnHelper.accessor('unknown', {
        cell: (info) => (
          <div className="flex items-center justify-end gap-x-2 tabular-nums">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{
                backgroundColor: SEVERITY_COLORS['unknown'],
              }}
            ></div>
            <DFLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                searchParams.set('severity', 'unknown');
                const path = generatePath(
                  `/secret/scan-results/:scanId/?${searchParams.toString()}`,
                  {
                    scanId: info.row.original.scan_id,
                  },
                );
                navigate(path);
              }}
            >
              {info.getValue()}
            </DFLink>
          </div>
        ),
        header: () => 'Unknown',
        minSize: 80,
        size: 80,
        maxSize: 80,
        enableResizing: false,
      }),
    ];

    return columns;
  }, []);

  return (
    <>
      {showDeleteDialog && (
        <DeleteConfirmationModal
          showDialog={showDeleteDialog}
          scanId={scanIdToDelete}
          nodeId={nodeIdToDelete}
          setShowDialog={setShowDeleteDialog}
        />
      )}
      <Table
        data={data.scans}
        columns={columns}
        enablePagination
        manualPagination
        enableColumnResizing
        approximatePagination
        totalRows={data.totalRows}
        pageSize={PAGE_SIZE}
        pageIndex={data.currentPage}
        onPaginationChange={(updaterOrValue) => {
          let newPageIndex = 0;
          if (typeof updaterOrValue === 'function') {
            newPageIndex = updaterOrValue({
              pageIndex: data.currentPage,
              pageSize: PAGE_SIZE,
            }).pageIndex;
          } else {
            newPageIndex = updaterOrValue.pageIndex;
          }
          setSearchParams((prev) => {
            prev.set('page', String(newPageIndex));
            return prev;
          });
        }}
        enableSorting
        manualSorting
        sortingState={sort}
        onSortingChange={(updaterOrValue) => {
          let newSortState: SortingState = [];
          if (typeof updaterOrValue === 'function') {
            newSortState = updaterOrValue(sort);
          } else {
            newSortState = updaterOrValue;
          }
          setSearchParams((prev) => {
            if (!newSortState.length) {
              prev.delete('sortby');
              prev.delete('desc');
            } else {
              prev.set('sortby', String(newSortState[0].id));
              prev.set('desc', String(newSortState[0].desc));
            }
            return prev;
          });
          setSort(newSortState);
        }}
      />
    </>
  );
};
const SecretScans = () => {
  const [searchParams] = useSearchParams();

  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const isFetching = useIsFetching({
    queryKey: queries.secret.scanList._def,
  });

  return (
    <div>
      <div className="flex pl-6 pr-4 py-2 w-full items-center bg-white dark:bg-bg-breadcrumb-bar">
        <Breadcrumb>
          <BreadcrumbLink asChild icon={<SecretsIcon />} isLink>
            <DFLink to={'/secret'} unstyled>
              Secrets
            </DFLink>
          </BreadcrumbLink>
          <BreadcrumbLink>
            <span className="inherit cursor-auto">Secret Scans</span>
          </BreadcrumbLink>
        </Breadcrumb>

        <div className="ml-2 flex items-center">
          {isFetching ? <CircleSpinner size="sm" /> : null}
        </div>
      </div>

      <div className="mx-4">
        <Button
          variant="flat"
          className="ml-auto py-2"
          startIcon={<FilterIcon />}
          endIcon={
            getAppliedFiltersCount(searchParams) > 0 ? (
              <Badge
                label={String(getAppliedFiltersCount(searchParams))}
                variant="filled"
                size="small"
                color="blue"
              />
            ) : null
          }
          size="sm"
          onClick={() => {
            setFiltersExpanded((prev) => !prev);
          }}
        >
          Filter
        </Button>
        {filtersExpanded ? <Filters /> : null}
        <Suspense fallback={<TableSkeleton columns={7} rows={15} />}>
          <ScansTable />
        </Suspense>
      </div>
    </div>
  );
};

export const module = {
  action,
  element: <SecretScans />,
};

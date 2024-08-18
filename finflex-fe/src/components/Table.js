import { useState, useEffect } from "react";
import classes from "./Table.module.css";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import {ConfigProvider, DatePicker, Space} from 'antd';
import locale from 'antd/locale/tr_TR';
import dayjs from 'dayjs';
import 'dayjs/locale/tr';
const { RangePicker } = DatePicker;

dayjs.locale('tr');

export default function Table({
                                  head,
                                  body,
                                  searchable,
                                  customerNumberFilter,
                                  accountNumberFilter,
                                  personelNumberFilter,
                                  dateFilter,
                                  onCustomerNumberChange,
                                  onAccountNumberChange,
                                  onPersonelNumberChange,
                                  onDateChange,
                                  onFilterApply,
                                  onFilterReset,
                                  role,
                                  loading
                              }) {
    const [sorting, setSorting] = useState(false);
    const [search, setSearch] = useState('');

    const filteredData = body && body
        .filter(items => items.some(
            item => (item?.key || item).toString().toLocaleLowerCase('TR').includes(search.toLocaleLowerCase('TR'))
        ))
        .sort((a, b) => {
            if (sorting?.orderBy === 'asc') {
                return (a[sorting.key]?.key || a[sorting.key]).toString().localeCompare(b[sorting.key]?.key || b[sorting.key]);
            }
            if (sorting?.orderBy === 'desc') {
                return (b[sorting.key]?.key || b[sorting.key]).toString().localeCompare(a[sorting.key]?.key || a[sorting.key]);
            }
        });

    return (
        <>
            {loading ? (
                <div className={classes['loading-info']}>Yükleniyor...</div>
            ) : (
                <>
                    {searchable && (
                        <>
                            <div className={classes['table-props']}>
                                <ConfigProvider locale={locale}>
                                    <Space direction="vertical" size={12}>
                                        <RangePicker
                                            picker="date"
                                            value={dateFilter}
                                            onChange={onDateChange}
                                            id={{
                                                start: 'startInput',
                                                end: 'endInput',
                                            }}
                                        />
                                    </Space>
                                </ConfigProvider>
                                <input
                                    type="text"
                                    placeholder="Müşteri Numarası"
                                    value={customerNumberFilter}
                                    onChange={onCustomerNumberChange}
                                    className={classes['filter-input']}
                                />
                                <input
                                    type="text"
                                    placeholder="Hesap Numarası"
                                    value={accountNumberFilter}
                                    onChange={onAccountNumberChange}
                                    className={classes['filter-input']}
                                />
                                {role === 'ADMIN' &&
                                    <input
                                        type="text"
                                        placeholder="Personel Numarası"
                                        value={personelNumberFilter}
                                        onChange={onPersonelNumberChange}
                                        className={classes['filter-input']}
                                    />
                                }
                            </div>
                            <div className={classes['filter-buttons']}>
                            <button
                                onClick={onFilterApply}
                                className={classes['filter-apply-button']}>
                                Filtreyi Uygula
                            </button>
                            <button
                                onClick={() => {
                                    setSearch('');
                                    setSorting(false);
                                    onFilterReset();
                                }}
                                className={classes['filter-clear-button']}>
                                Filtreyi Temizle
                            </button>
                            </div>
                            </>
                            )}
                            <div className={classes['w-full']}>
                                <table className={classes['w-full']} bgcolor="white">
                                    <thead>
                                    <tr>
                                        {head.map((h, key) => (
                                            <th
                                                className={classes['table-head']}
                                                key={key}>
                                                <div className={classes['table-head-inside']}>
                                                    {h.name}
                                                    {h.sortable && (
                                                        <button className={classes['icon-button']} onClick={() => {
                                                            if (sorting?.key === key) {
                                                                setSorting({
                                                                    key,
                                                                    orderBy: sorting.orderBy === 'asc' ? 'desc' : 'asc'
                                                                });
                                                            } else {
                                                                setSorting({
                                                                    key,
                                                                    orderBy: 'asc'
                                                                });
                                                            }
                                                        }}>
                                                            {sorting?.key === key && (
                                                                sorting.orderBy === 'asc' ? <ArrowUpwardIcon/> :
                                                                    <ArrowDownwardIcon/>
                                                            )}
                                                            {sorting?.key !== key && <SwapVertIcon/>}
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((items, key) => (
                                            <tr className={classes['table-body']} key={key}>
                                                {items.map((item, key) => (
                                                    <td
                                                        className={classes['table-body-inside']}
                                                        key={key}>
                                                        {Array.isArray(item) ? (
                                                            <div className={classes['data-item-inside']}>
                                                                {item}
                                                            </div>
                                                        ) : item}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={head.length} className={classes['data-info']}>Veri
                                                Bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </>
            );
            }

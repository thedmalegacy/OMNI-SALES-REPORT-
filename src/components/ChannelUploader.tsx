import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, ArrowRight, Layers } from 'lucide-react';
import { ChannelType, OrderItem } from '../types';
import { parseUploadedFile } from '../utils/reportParser';
import { CSV_TEMPLATES } from '../data/sampleData';

interface ChannelUploaderProps {
  onOrdersAdded: (newOrders: OrderItem[]) => void;
  channelCounts: Record<ChannelType, number>;
  channelRevenues: Record<ChannelType, number>;
  currencySymbol: string;
}

const CHANNELS: { id: ChannelType; name: string; color: string; badgeBg: string; logoText: string; desc: string }[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    color: 'amber',
    badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
    logoText: 'AMZ',
    desc: 'Upload MTR, Order, or Settlement Reports'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    color: 'blue',
    badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    logoText: 'FK',
    desc: 'Upload Sales, Orders or Return Settlement Reports'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    color: 'pink',
    badgeBg: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
    logoText: 'MSH',
    desc: 'Upload Sub-Order Payment & Delivery Reports'
  },
  {
    id: 'website',
    name: 'Brand Website',
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    logoText: 'DTC',
    desc: 'Upload Shopify, WooCommerce or Custom DTC CSV'
  }
];

export const ChannelUploader: React.FC<ChannelUploaderProps> = ({
  onOrdersAdded,
  channelCounts,
  channelRevenues,
  currencySymbol
}) => {
  const [activeTab, setActiveTab] = useState<ChannelType>('amazon');
  const [isParsing, setIsParsing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setIsParsing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsedOrders = await parseUploadedFile(file, activeTab);
      if (parsedOrders.length === 0) {
        setErrorMsg('No valid order rows could be recognized in the file. Check column headers.');
      } else {
        onOrdersAdded(parsedOrders);
        setSuccessMsg(`Successfully imported ${parsedOrders.length} orders for ${activeTab.toUpperCase()}!`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to parse ${file.name}: ${err.message || 'Invalid format'}`);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownloadTemplate = (channel: ChannelType) => {
    const content = CSV_TEMPLATES[channel];
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${channel}_sales_report_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedChannelObj = CHANNELS.find(c => c.id === activeTab)!;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Upload className="w-5 h-5 text-indigo-600" />
            Upload Marketplace Sales Reports
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Import CSV or Excel (.xlsx) reports directly from Amazon, Flipkart, Meesho, or your DTC Store.
          </p>
        </div>

        {/* Channel Selector Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          {CHANNELS.map(ch => {
            const count = channelCounts[ch.id] || 0;
            const isActive = activeTab === ch.id;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  setActiveTab(ch.id);
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${count > 0 ? (isActive ? 'bg-white' : 'bg-emerald-500 animate-pulse') : 'bg-slate-300'}`} />
                <span>{ch.name}</span>
                {count > 0 && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Zone & Status for Selected Channel */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* Dropzone Box */}
        <div className="md:col-span-2 border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls,.tsv"
            className="hidden"
            id="report-file-input"
          />

          <div className="p-3 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform mb-3 text-indigo-600">
            <FileSpreadsheet className="w-8 h-8 text-indigo-600" />
          </div>

          <label htmlFor="report-file-input" className="cursor-pointer">
            <span className="text-sm font-bold text-indigo-600 hover:underline">Click to upload {selectedChannelObj.name} report</span>
            <span className="text-xs text-slate-500 font-medium block mt-1">Supports .csv, .xlsx, or .xls files from seller central</span>
          </label>

          <p className="text-xs text-slate-400 mt-2">
            Auto-detects Order ID, SKU, Quantity, Price, Fees, Shipping, and Returns
          </p>

          <div className="mt-4 flex items-center space-x-3">
            <button
              onClick={() => handleDownloadTemplate(activeTab)}
              className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download {selectedChannelObj.name} CSV Template</span>
            </button>
          </div>
        </div>

        {/* Selected Channel Summary Card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs px-2.5 py-1 rounded-lg font-bold uppercase bg-indigo-100 text-indigo-700">
                {selectedChannelObj.name}
              </span>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {channelCounts[activeTab] || 0} Orders
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-3">
              {selectedChannelObj.desc}
            </p>

            <div className="mt-5 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Net Revenue</div>
              <div className="text-2xl font-black text-slate-800 font-mono mt-0.5">
                {currencySymbol}{(channelRevenues[activeTab] || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {isParsing && (
            <div className="mt-3 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs p-2.5 rounded-xl flex items-center space-x-2 font-medium">
              <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <span>Parsing {selectedChannelObj.name} data...</span>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs p-3 rounded-xl flex items-start space-x-2 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs p-3 rounded-xl flex items-start space-x-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

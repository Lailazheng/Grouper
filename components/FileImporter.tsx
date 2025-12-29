
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { Student } from '../types';
import { CASE_STUDIES } from '../constants';

interface Props {
  onDataLoaded: (students: Student[]) => void;
}

const FileImporter: React.FC<Props> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const findCaseId = (value: string): string | null => {
    if (!value) return null;
    const cleanValue = value.trim().toLowerCase();
    const found = CASE_STUDIES.find(cs => 
      cs.name.toLowerCase().includes(cleanValue) || 
      cleanValue.includes(cs.name.toLowerCase()) ||
      cleanValue === cs.id
    );
    return found ? found.id : null;
  };

  const processData = (data: any[]) => {
    const newStudents: Student[] = [];
    
    data.forEach((row: any) => {
      // Robust column finding
      const name = row['Name'] || row['Student Name'] || row['Full Name'] || Object.values(row)[0];
      const p1Raw = row['Preference 1'] || row['Pref 1'] || row['Rank 1'] || Object.values(row)[1];
      const p2Raw = row['Preference 2'] || row['Pref 2'] || row['Rank 2'] || Object.values(row)[2];
      const p3Raw = row['Preference 3'] || row['Pref 3'] || row['Rank 3'] || Object.values(row)[3];

      if (name && typeof name === 'string' && name.trim()) {
        const p1 = findCaseId(String(p1Raw));
        const p2 = findCaseId(String(p2Raw));
        const p3 = findCaseId(String(p3Raw));

        if (p1 && p2) {
          newStudents.push({
            id: crypto.randomUUID(),
            name: name.trim(),
            rankings: [p1, p2, p3].filter(Boolean) as string[],
          });
        }
      }
    });

    if (newStudents.length > 0) {
      onDataLoaded(newStudents);
    } else {
      alert("Could not find valid student data. Please ensure columns include 'Name', 'Preference 1', and 'Preference 2'.");
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => processData(results.data),
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        processData(json);
      };
      reader.readAsBinaryString(file);
    } else {
      alert("Unsupported file format. Please upload .csv, .xlsx, or .xls");
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".csv, .xlsx, .xls"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1">
        <i className="fa-solid fa-file-import text-xl"></i>
      </div>
      <p className="text-sm font-bold text-slate-700">Import Students</p>
      <p className="text-xs text-slate-500 text-center">
        Drop CSV or Excel here<br/>
        <span className="opacity-60 text-[10px]">Columns: Name, Preference 1, Preference 2</span>
      </p>
    </div>
  );
};

export default FileImporter;

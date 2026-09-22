import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  ChevronRight, 
  Building2,
  Stethoscope,
  Filter,
  Search,
  Volume2
} from 'lucide-react';
import { QueueEntry } from '../../types';

interface OpdQueueManagerProps {
  currentQueue: QueueEntry[];
  onSelectPatient: (entry: QueueEntry) => void;
}

const INITIAL_MOCK_QUEUE: QueueEntry[] = [
  {
    tokenNumber: 'P1-EMERGENCY-001',
    patientId: 'pat-emg-1',
    patientName: 'Kishore Sengupta',
    age: 58,
    gender: 'Male',
    abhaId: '91-1122-3344-5566',
    chiefComplaint: 'Severe substernal crushing chest pain with radiation to left arm',
    triagePriority: 'P1 - EMERGENCY',
    status: 'Triage Fast-Track',
    intakeTime: '08:42 IST',
    emergencyAlert: true,
    emergencyReason: 'Suspected Acute Coronary Syndrome (ACS) - Red Flag Alert',
    opdDepartment: 'Emergency / Cardiology',
    consultationRoom: 'Room 102 (Resuscitation Bay)',
  },
  {
    tokenNumber: 'OPD-A-038',
    patientId: 'pat-1',
    patientName: 'Rajesh Kumar Sharma',
    age: 52,
    gender: 'Male',
    abhaId: '91-4523-8821-9043',
    chiefComplaint: 'Recurrent severe epigastric pain post-meals with nausea',
    triagePriority: 'P2 - URGENT',
    status: 'Waiting',
    intakeTime: '08:50 IST',
    emergencyAlert: false,
    opdDepartment: 'General Medicine',
    consultationRoom: 'Room 204',
  },
  {
    tokenNumber: 'OPD-A-039',
    patientId: 'pat-2',
    patientName: 'Anita Ben Patel',
    age: 46,
    gender: 'Female',
    abhaId: '91-7712-4091-2358',
    chiefComplaint: 'Uncontrolled diabetes checkup, HbA1c review from previous lab',
    triagePriority: 'P3 - ROUTINE',
    status: 'Waiting',
    intakeTime: '08:55 IST',
    emergencyAlert: false,
    opdDepartment: 'Endocrinology / OPD',
    consultationRoom: 'Room 206',
  },
  {
    tokenNumber: 'AYUSH-012',
    patientId: 'pat-3',
    patientName: 'Ramulu Kethavath',
    age: 63,
    gender: 'Male',
    abhaId: '91-3349-1120-6754',
    chiefComplaint: 'Chronic osteoarthritis bilateral knees with digestive sluggishness',
    triagePriority: 'P3 - ROUTINE',
    status: 'Waiting',
    intakeTime: '09:05 IST',
    emergencyAlert: false,
    opdDepartment: 'AYUSH Specialty Clinic',
    consultationRoom: 'Room 301',
  },
  {
    tokenNumber: 'OPD-A-040',
    patientId: 'pat-4',
    patientName: 'Meera Nambiar',
    age: 29,
    gender: 'Female',
    abhaId: '91-8821-9900-1122',
    chiefComplaint: 'High fever for 2 days with chills and thrombocytopenia suspicion',
    triagePriority: 'P2 - URGENT',
    status: 'Waiting',
    intakeTime: '09:12 IST',
    emergencyAlert: false,
    opdDepartment: 'General Medicine',
    consultationRoom: 'Room 204',
  },
];

export const OpdQueueManager: React.FC<OpdQueueManagerProps> = ({
  currentQueue,
  onSelectPatient,
}) => {
  const [queue, setQueue] = useState<QueueEntry[]>([
    ...currentQueue,
    ...INITIAL_MOCK_QUEUE.filter(mock => !currentQueue.some(q => q.tokenNumber === mock.tokenNumber))
  ]);

  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQueue = queue.filter(item => {
    if (selectedFilter === 'P1' && !item.triagePriority.startsWith('P1')) return false;
    if (selectedFilter === 'P2' && !item.triagePriority.startsWith('P2')) return false;
    if (selectedFilter === 'P3' && !item.triagePriority.startsWith('P3')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(q) ||
        item.tokenNumber.toLowerCase().includes(q) ||
        item.chiefComplaint.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const p1Count = queue.filter(q => q.triagePriority.startsWith('P1')).length;
  const p2Count = queue.filter(q => q.triagePriority.startsWith('P2')).length;
  const p3Count = queue.filter(q => q.triagePriority.startsWith('P3')).length;

  const handleCallPatient = (token: string) => {
    setQueue(prev => prev.map(item => item.tokenNumber === token ? { ...item, status: 'In Consultation' } : item));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Indian OPD Volume Stats (Slide 5 Requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                OPD Patient Flow & Emergency Triage Monitor
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  Live Queue
                </span>
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                Handling 4,000–10,000 daily OPD volume with automated red-flag prioritization (SIH26047 Slide 5)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
              OPD Hospital Capacity: <strong>7,500 Patients / Day</strong>
            </span>
          </div>
        </div>

        {/* 4 Impact Metric Cards (From Slide 5) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
            <div className="text-[11px] font-bold text-teal-800 uppercase tracking-wide">
              Avg Consultation Time
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-950 mt-1">
              3.2 Mins <span className="text-xs font-normal text-teal-700">(was 11m)</span>
            </div>
            <div className="text-[11px] text-teal-700 mt-0.5 flex items-center gap-1 font-semibold">
              <TrendingDown className="w-3.5 h-3.5" /> 71% time savings
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
              Doctor Hours Saved Today
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-950 mt-1">
              214.5 Hours
            </div>
            <div className="text-[11px] text-blue-700 mt-0.5">
              Across 38 active OPD counters
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
              Repeated Tests Prevented
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-amber-950 mt-1">
              38.6% Saved
            </div>
            <div className="text-[11px] text-amber-700 mt-0.5">
              Chronological history saves patient money
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wide">
              Critical Red-Flags Triage
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-rose-950 mt-1">
              {p1Count} Patients (P1)
            </div>
            <div className="text-[11px] text-rose-700 mt-0.5 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" /> Fast-tracked to Resus
            </div>
          </div>
        </div>
      </div>

      {/* Triage Priority Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedFilter === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Patients ({queue.length})
          </button>

          <button
            onClick={() => setSelectedFilter('P1')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              selectedFilter === 'P1'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>P1 - Emergency ({p1Count})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('P2')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedFilter === 'P2'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            P2 - Urgent ({p2Count})
          </button>

          <button
            onClick={() => setSelectedFilter('P3')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedFilter === 'P3'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            P3 - Routine ({p3Count})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, token, symptom..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Queue List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold uppercase text-slate-500 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Token & Priority</th>
                <th className="py-3.5 px-4">Patient Profile</th>
                <th className="py-3.5 px-4">Chief Complaint & AI Red Flags</th>
                <th className="py-3.5 px-4">Department & Room</th>
                <th className="py-3.5 px-4">Intake Time</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue.map((entry) => {
                const isP1 = entry.triagePriority.startsWith('P1');
                const isP2 = entry.triagePriority.startsWith('P2');
                return (
                  <tr
                    key={entry.tokenNumber}
                    className={`hover:bg-slate-50/80 transition ${
                      isP1 ? 'bg-red-50/40' : ''
                    }`}
                  >
                    {/* Token */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-extrabold text-sm text-slate-900">
                        {entry.tokenNumber}
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded uppercase mt-0.5 ${
                        isP1
                          ? 'bg-red-600 text-white'
                          : isP2
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {entry.triagePriority}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{entry.patientName}</div>
                      <div className="text-slate-500 text-[11px]">{entry.age}Y, {entry.gender}</div>
                      <div className="font-mono text-slate-400 text-[10px] mt-0.5">{entry.abhaId}</div>
                    </td>

                    {/* Complaint & Red Flags */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="text-slate-800 font-medium line-clamp-2">
                        {entry.chiefComplaint}
                      </div>
                      {entry.emergencyAlert && (
                        <div className="flex items-center gap-1 text-red-700 text-[11px] font-bold mt-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{entry.emergencyReason}</span>
                        </div>
                      )}
                    </td>

                    {/* Department & Room */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{entry.opdDepartment}</div>
                      <div className="text-teal-700 font-semibold text-[11px]">{entry.consultationRoom}</div>
                    </td>

                    {/* Time & Status */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-600">{entry.intakeTime}</div>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-semibold mt-0.5 ${
                        entry.status === 'Triage Fast-Track'
                          ? 'bg-rose-100 text-rose-800 animate-pulse'
                          : entry.status === 'In Consultation'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {entry.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectPatient(entry)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition"
                        >
                          View Case
                        </button>
                        {entry.status === 'Waiting' && (
                          <button
                            onClick={() => handleCallPatient(entry.tokenNumber)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                            title="Call Patient into Room"
                          >
                            Call In
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

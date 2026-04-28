import React from 'react';

const s = {
  entity: {
    border: '2px solid #5a8a5a', borderRadius: '8px', padding: '10px',
    background: '#e8f5e9', fontSize: '10px', minWidth: '130px',
  },
  process: {
    border: '2px solid #4a7ab5', borderRadius: '8px', padding: '10px',
    background: '#ddeeff', fontSize: '10px', textAlign: 'center',
  },
  dataStore: {
    border: '2px solid #888', borderRadius: '4px', padding: '6px 12px',
    background: '#f5f5f5', fontSize: '10px', textAlign: 'center', minWidth: '80px',
  },
  processBox: {
    border: '2px solid #4a7ab5', borderRadius: '8px', padding: '8px 14px',
    background: '#ddeeff', fontSize: '10px', textAlign: 'center', minWidth: '140px',
  },
  arrow: { display: 'flex', alignItems: 'center', fontSize: '9px', gap: '3px', color: '#333' },
  arrowLine: { flex: 1, height: '1px', background: '#555', minWidth: '20px' },
  label: { fontSize: '9px', color: '#333', whiteSpace: 'nowrap' },
};

const Arrow = ({ label, dir = 'right', dashed = false }) => (
  <div style={{ ...s.arrow, flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
    <span style={s.label}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {dir === 'left' && <span>◀</span>}
      <div style={{ ...s.arrowLine, borderTop: dashed ? '1px dashed #555' : '1px solid #555', height: 0, minWidth: '30px' }} />
      {dir === 'right' && <span>▶</span>}
      {dir === 'both' && <><span style={{ marginLeft: '-6px' }}>◀</span><div style={{ width: '30px', borderTop: dashed ? '1px dashed #555' : '1px solid #555' }} /><span>▶</span></>}
    </div>
  </div>
);

const VArrow = ({ label, dir = 'down', dashed = false }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px' }}>
    {dir === 'up' && <span style={{ fontSize: '10px' }}>▲</span>}
    <div style={{ width: '1px', height: '18px', borderLeft: dashed ? '1px dashed #555' : '1px solid #555' }} />
    {dir === 'down' && <span style={{ fontSize: '10px' }}>▼</span>}
    {label && <span style={{ ...s.label, marginTop: '2px' }}>{label}</span>}
  </div>
);

const DFDDiagram = () => (
  <div style={{ background: '#fff', padding: '28px', fontFamily: 'Arial, sans-serif', minWidth: '1100px', color: '#111' }}>

    {/* ── TITLE ── */}
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '4px', borderBottom: '2px solid #333', paddingBottom: '8px' }}>
      3.2 DATA FLOW DIAGRAM (DFD) – APPOINTMENT & DOUBT FLOW
    </div>

    {/* ══════════════════════════════════════════════
        LEVEL 0 – CONTEXT DIAGRAM
    ══════════════════════════════════════════════ */}
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', margin: '16px 0 12px', color: '#1a4a8a' }}>
      Level 0 – Context Diagram
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', marginBottom: '8px' }}>

      {/* USER entity */}
      <div style={{ ...s.entity, minWidth: '150px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>👤</span>
          <div><div style={{ fontWeight: 'bold' }}>USER</div><div style={{ fontSize: '9px' }}>(Student / Faculty)</div></div>
        </div>
        <div style={{ fontSize: '9px', lineHeight: '1.6' }}>
          • Book Appointments<br />
          • View Office Hours<br />
          • Submit Doubts<br />
          • Track Status<br />
          • View Profile
        </div>
      </div>

      {/* USER → System arrows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px', color: '#333' }}>
        {['Register / Login →', 'Book Appointment →', 'Submit Doubt →', 'View Office Hours →', '← Appointment Status', '← Notifications'].map(t => (
          <div key={t} style={{ whiteSpace: 'nowrap' }}>{t}</div>
        ))}
      </div>

      {/* Central System */}
      <div style={{ border: '3px solid #333', borderRadius: '10px', padding: '18px 24px', background: '#ddeeff', textAlign: 'center', minWidth: '200px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>STUDENT DOUBT</div>
        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>PLATFORM</div>
        <div style={{ fontSize: '9px', color: '#555', marginTop: '4px' }}>Appointment & Office Hours</div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px', fontSize: '9px' }}>
          {['User Profiles', 'Office Hours', 'Appointments'].map(d => (
            <div key={d} style={{ border: '1px solid #4a7ab5', borderRadius: '3px', padding: '3px 5px', background: '#fff' }}>{d}</div>
          ))}
        </div>
      </div>

      {/* System → ADMIN arrows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '9px', color: '#333' }}>
        {['→ Manage Users', '→ Manage Office Hours', '→ View Appointments', '→ Approve / Cancel', '← User Data', '← Reports'].map(t => (
          <div key={t} style={{ whiteSpace: 'nowrap' }}>{t}</div>
        ))}
      </div>

      {/* ADMIN entity */}
      <div style={{ ...s.entity, minWidth: '140px', borderColor: '#4a7ab5', background: '#ddeeff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <div><div style={{ fontWeight: 'bold' }}>ADMIN</div></div>
        </div>
        <div style={{ fontSize: '9px', lineHeight: '1.6' }}>
          • Manage Users<br />
          • View All Appointments<br />
          • Manage Reports<br />
          • System Control
        </div>
      </div>
    </div>

    {/* Bottom of Level 0 */}
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', padding: '0 20px' }}>
      <div style={{ border: '1px solid #5a8a5a', borderRadius: '6px', padding: '8px 12px', background: '#e8f5e9', fontSize: '9px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>External Entities</div>
        <div>1. Students</div>
        <div>2. Faculty</div>
        <div>3. Admin</div>
      </div>
      <div style={{ border: '1px solid #888', borderRadius: '6px', padding: '8px 12px', background: '#f5f5f5', fontSize: '9px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Data Stores (High Level)</div>
        <div>D1: Users</div>
        <div>D2: Office Hours</div>
        <div>D3: Appointments</div>
      </div>
    </div>

    {/* Divider */}
    <div style={{ borderTop: '2px dashed #aaa', margin: '16px 0' }} />

    {/* ══════════════════════════════════════════════
        LEVEL 1 – DATA FLOW DIAGRAM
    ══════════════════════════════════════════════ */}
    <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '13px', marginBottom: '16px', color: '#1a4a8a' }}>
      Level 1 – Data Flow Diagram
    </div>

    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

      {/* ── LEFT: USER + ADMIN entities ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '90px' }}>
        <div style={{ ...s.entity, textAlign: 'center', padding: '8px' }}>
          <div style={{ fontSize: '20px' }}>👤</div>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>USER</div>
          <div style={{ fontSize: '8px' }}>(Student / Faculty)</div>
        </div>
        <div style={{ height: '60px' }} />
        <div style={{ height: '60px' }} />
        <div style={{ height: '60px' }} />
        <div style={{ ...s.entity, textAlign: 'center', padding: '8px', borderColor: '#4a7ab5', background: '#ddeeff' }}>
          <div style={{ fontSize: '20px' }}>🛡️</div>
          <div style={{ fontWeight: 'bold', fontSize: '10px' }}>ADMIN</div>
        </div>
      </div>

      {/* ── MIDDLE: flow labels ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', fontSize: '9px', color: '#333', minWidth: '110px', paddingTop: '10px' }}>
        {[
          '1.1 Register / Login →',
          '',
          '1.2 Book Appointment →',
          '',
          '1.3 Submit Doubt →',
          '',
          '1.4 View / Manage →',
          '',
          '',
          '',
          '1.5 Manage System →',
        ].map((t, i) => <div key={i} style={{ height: '28px', display: 'flex', alignItems: 'center' }}>{t}</div>)}
      </div>

      {/* ── PROCESSES ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '160px' }}>
        {[
          ['1.0', 'User Authentication'],
          ['2.0', 'Office Hours Management'],
          ['3.0', 'Appointment Management'],
          ['4.0', 'Doubt Management'],
          ['5.0', 'Admin & Reports'],
        ].map(([num, name]) => (
          <div key={num} style={{ ...s.processBox }}>
            <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{num}</div>
            <div>{name}</div>
          </div>
        ))}
      </div>

      {/* ── DATA FLOW ARROWS (process → store) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '130px', paddingTop: '4px' }}>
        {[
          ['Auth Data →', '← JWT Token'],
          ['Office Hours Data →', '← Office Hours List'],
          ['Appointment Data →', '← Appointment Status'],
          ['Doubt Text →', '← Doubt Confirmed'],
          ['Admin Data →', '← Reports'],
        ].map(([a, b], i) => (
          <div key={i} style={{ height: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '9px', color: '#333' }}>
            <div>{a}</div>
            <div>{b}</div>
          </div>
        ))}
      </div>

      {/* ── DATA STORES ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '100px' }}>
        {[
          ['D1', 'Users'],
          ['D2', 'Office Hours'],
          ['D3', 'Appointments'],
          ['D3', 'Appointments'],
          ['D1', 'Users'],
        ].map(([id, name], i) => (
          <div key={i} style={{ ...s.dataStore, height: '44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontWeight: 'bold' }}>{id}</div>
            <div>{name}</div>
          </div>
        ))}
      </div>

    </div>

    {/* ── LEGEND ── */}
    <div style={{ marginTop: '24px', border: '1px solid #aaa', borderRadius: '6px', padding: '10px 16px', display: 'inline-flex', gap: '24px', fontSize: '9px', background: '#fafafa' }}>
      <div style={{ fontWeight: 'bold', fontSize: '10px' }}>LEGEND</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '28px', height: '18px', border: '2px solid #4a7ab5', borderRadius: '50%', background: '#ddeeff' }} />
        <span>Process</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '28px', height: '18px', border: '2px solid #5a8a5a', borderRadius: '4px', background: '#e8f5e9' }} />
        <span>External Entity</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '28px', height: '18px', border: '2px solid #888', background: '#f5f5f5' }} />
        <span>Data Store</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '30px', borderTop: '1px solid #333' }} />
        <span>▶ Data Flow</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
        <div style={{ width: '30px', borderTop: '1px dashed #333' }} />
        <span>▶ Data Access</span>
      </div>
    </div>

  </div>
);

export default DFDDiagram;

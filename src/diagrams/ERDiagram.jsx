import React from 'react';

/* ── Reusable shapes ── */
const Ellipse = ({ label, sub, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse rx="52" ry="22" fill="#fff" stroke="#111" strokeWidth="1.5" />
    <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="Arial">
      {label}
    </text>
    {sub && (
      <text y="11" textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="Arial" fill="#555">
        {sub}
      </text>
    )}
  </g>
);

const PKEllipse = ({ label, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse rx="52" ry="22" fill="#fff" stroke="#111" strokeWidth="1.5" />
    <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="Arial" textDecoration="underline">
      {label}
    </text>
  </g>
);

const Entity = ({ label, x, y, w = 130, h = 44 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#fff" stroke="#111" strokeWidth="2" />
    <text textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="bold" fontFamily="Arial">
      {label}
    </text>
  </g>
);

const Diamond = ({ label, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <polygon points="0,-22 52,0 0,22 -52,0" fill="#fff" stroke="#111" strokeWidth="1.5" />
    <text textAnchor="middle" dominantBaseline="middle" fontSize="10" fontFamily="Arial">
      {label}
    </text>
  </g>
);

const AttrList = ({ attrs, x, y }) => (
  <g transform={`translate(${x},${y})`}>
    {attrs.map((a, i) => (
      <text key={i} x="0" y={i * 16} fontSize="10" fontFamily="Arial" fill="#111">
        <tspan fontSize="11">•</tspan> {a}
      </text>
    ))}
  </g>
);

const Line = ({ x1, y1, x2, y2, dashed = false }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2}
    stroke="#111" strokeWidth="1.5"
    strokeDasharray={dashed ? '5,4' : undefined} />
);

const Arrow = ({ x1, y1, x2, y2 }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const tip = { x: x2, y: y2 };
  const b1 = { x: x2 - ux * 10 - uy * 5, y: y2 - uy * 10 + ux * 5 };
  const b2 = { x: x2 - ux * 10 + uy * 5, y: y2 - uy * 10 - ux * 5 };
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111" strokeWidth="1.5" />
      <polygon points={`${tip.x},${tip.y} ${b1.x},${b1.y} ${b2.x},${b2.y}`} fill="#111" />
    </g>
  );
};

const Cardinality = ({ label, x, y }) => (
  <text x={x} y={y} textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="Arial" fill="#111">
    {label}
  </text>
);

/* ══════════════════════════════════════════════════════
   MAIN DIAGRAM
══════════════════════════════════════════════════════ */
const ERDiagram = () => (
  <div style={{ background: '#fff', padding: '20px', overflowX: 'auto' }}>
    <svg width="1060" height="680" style={{ fontFamily: 'Arial, sans-serif' }}>

      {/* ── TITLE ── */}
      <text x="530" y="28" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="Arial">
        Entity-Relationship Diagram – Student Doubt Platform
      </text>

      {/* ════════════════════════════════
          USERS  (center-left, y=160)
      ════════════════════════════════ */}
      <Entity label="USERS" x={220} y={160} />

      {/* USERS attributes */}
      <PKEllipse label="id (PK)"      x={130} y={60}  />
      <Ellipse   label="name"         x={220} y={60}  />
      <Ellipse   label="email"        x={320} y={75}  sub="(Unique)" />
      <Ellipse   label="password"     x={100} y={130} />
      <Ellipse   label="role"         x={90}  y={175} />
      <Ellipse   label="student/faculty" sub="/admin" x={75} y={225} />
      <Ellipse   label="department"   x={110} y={270} />
      <Ellipse   label="created_at"   x={230} y={270} />

      {/* USERS attr lines */}
      <Line x1={175} y1={138} x2={148} y2={78} />
      <Line x1={200} y1={138} x2={220} y2={82} />
      <Line x1={240} y1={140} x2={305} y2={90} />
      <Line x1={170} y1={155} x2={120} y2={143} />
      <Line x1={165} y1={162} x2={108} y2={175} />
      <Line x1={163} y1={170} x2={105} y2={220} />
      <Line x1={175} y1={178} x2={140} y2={258} />
      <Line x1={220} y1={182} x2={230} y2={258} />

      {/* ════════════════════════════════
          OFFICE_HOURS  (center, y=160)
      ════════════════════════════════ */}
      <Entity label="OFFICE_HOURS" x={530} y={160} w={150} />

      {/* OFFICE_HOURS attributes */}
      <PKEllipse label="id (PK)"        x={430} y={60}  />
      <Ellipse   label="faculty_id"     x={530} y={60}  sub="(FK)" />
      <Ellipse   label="faculty_name"   x={635} y={60}  />
      <Ellipse   label="date"           x={700} y={110} />
      <Ellipse   label="time"           x={720} y={160} />
      <Ellipse   label="is_booked"      x={710} y={210} />
      <Ellipse   label="created_at"     x={640} y={255} />

      {/* OFFICE_HOURS attr lines */}
      <Line x1={480} y1={138} x2={448} y2={78} />
      <Line x1={510} y1={138} x2={530} y2={82} />
      <Line x1={560} y1={140} x2={618} y2={74} />
      <Line x1={595} y1={150} x2={652} y2={116} />
      <Line x1={600} y1={160} x2={668} y2={160} />
      <Line x1={598} y1={170} x2={662} y2={204} />
      <Line x1={580} y1={178} x2={622} y2={248} />

      {/* ════════════════════════════════
          APPOINTMENTS  (bottom-center, y=430)
      ════════════════════════════════ */}
      <Entity label="APPOINTMENTS" x={530} y={430} w={155} />

      {/* APPOINTMENTS attributes */}
      <AttrList x={370} y={390} attrs={[
        'id (PK)',
        'student_id (FK)',
        'student_name',
        'faculty_id (FK)',
        'faculty_name',
        'office_hour_id (FK)',
        'date',
        'time',
        'doubt',
        'status',
        'created_at',
      ]} />

      {/* ════════════════════════════════
          RELATIONSHIPS
      ════════════════════════════════ */}

      {/* USERS –[Creates]– OFFICE_HOURS */}
      <Diamond label="Creates" x={375} y={160} />
      <Line x1={285} y1={160} x2={323} y2={160} />
      <Line x1={427} y1={160} x2={455} y2={160} />
      <Cardinality label="1" x={308} y={153} />
      <Cardinality label="M" x={442} y={153} />

      {/* USERS –[Books]– APPOINTMENTS */}
      <Diamond label="Books" x={375} y={310} />
      <Line x1={220} y1={182} x2={220} y2={310} />
      <Line x1={220} y1={310} x2={323} y2={310} />
      <Line x1={427} y1={310} x2={530} y2={310} />
      <Arrow x1={530} y1={310} x2={530} y2={408} />
      <Cardinality label="1" x={235} y={305} />
      <Cardinality label="M" x={510} y={305} />

      {/* OFFICE_HOURS –[Has]– APPOINTMENTS */}
      <Diamond label="Has" x={660} y={310} />
      <Line x1={530} y1={182} x2={530} y2={220} />
      <Line x1={530} y1={220} x2={660} y2={220} />
      <Line x1={660} y1={220} x2={660} y2={288} />
      <Line x1={660} y1={332} x2={660} y2={380} />
      <Arrow x1={660} y1={380} x2={608} y2={420} />
      <Cardinality label="1" x={648} y={240} />
      <Cardinality label="M" x={648} y={370} />

      {/* ════════════════════════════════
          LEGEND
      ════════════════════════════════ */}
      <g transform="translate(760, 420)">
        <rect x="0" y="0" width="260" height="200" fill="#fff" stroke="#111" strokeWidth="1.5" strokeDasharray="5,3" rx="4" />
        <text x="130" y="22" textAnchor="middle" fontSize="12" fontWeight="bold" fontFamily="Arial">LEGEND</text>

        {/* Attribute */}
        <ellipse cx="40" cy="50" rx="30" ry="16" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <text x="40" y="54" textAnchor="middle" fontSize="9" fontFamily="Arial">Attribute</text>
        <text x="80" y="54" fontSize="10" fontFamily="Arial">Attribute</text>

        {/* Entity */}
        <rect x="10" y="78" width="60" height="24" fill="#fff" stroke="#111" strokeWidth="2" />
        <text x="40" y="94" textAnchor="middle" fontSize="9" fontWeight="bold" fontFamily="Arial">Entity</text>
        <text x="80" y="94" fontSize="10" fontFamily="Arial">Entity</text>

        {/* Relationship */}
        <polygon points="40,118 70,130 40,142 10,130" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <text x="40" y="134" textAnchor="middle" fontSize="9" fontFamily="Arial">Rel</text>
        <text x="80" y="134" fontSize="10" fontFamily="Arial">Relationship</text>

        {/* 1 / M */}
        <text x="10" y="165" fontSize="12" fontWeight="bold" fontFamily="Arial">1</text>
        <text x="30" y="165" fontSize="10" fontFamily="Arial">= One</text>
        <text x="100" y="165" fontSize="12" fontWeight="bold" fontFamily="Arial">M</text>
        <text x="120" y="165" fontSize="10" fontFamily="Arial">= Many</text>

        {/* PK / FK */}
        <text x="10" y="185" fontSize="10" fontFamily="Arial" textDecoration="underline">PK</text>
        <text x="30" y="185" fontSize="10" fontFamily="Arial">= Primary Key</text>
        <text x="130" y="185" fontSize="10" fontFamily="Arial">FK = Foreign Key</text>
      </g>

    </svg>
  </div>
);

export default ERDiagram;

import React from 'react';

const config = {
  pending:   { cls: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500' },
  approved:  { cls: 'bg-blue-100 text-blue-800',    dot: 'bg-blue-500'   },
  completed: { cls: 'bg-green-100 text-green-800',  dot: 'bg-green-500'  },
  cancelled: { cls: 'bg-red-100 text-red-800',      dot: 'bg-red-500'    },
};

const StatusBadge = ({ status }) => {
  const { cls, dot } = config[status] || config.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
};

export default StatusBadge;

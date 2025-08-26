const AuditLog = require('../models/auditLogModel');

exports.logAudit = async ({ req, action, entity, entityId, metadata = {} }) => {
  try {
    const actor = req?.user;
    await AuditLog.create({
      actorId: actor?._id,
      actorEmail: actor?.email,
      action,
      entity,
      entityId: String(entityId),
      metadata,
      ip: req?.ip,
      userAgent: req?.headers?.['user-agent'] || '',
    });
  } catch (err) {
    // Fail-closed: do not crash business flow on audit failure
    console.error('Audit log error:', err?.message || err);
  }
};



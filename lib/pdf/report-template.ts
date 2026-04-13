type ReportLike = {
  diagnosisSummary: string;
  headline: string;
  about: string;
};

export function reportToPlainText(report: ReportLike) {
  return `Diagnóstico\n${report.diagnosisSummary}\n\nHeadline\n${report.headline}\n\nSobre\n${report.about}`;
}

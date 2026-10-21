import jsPDF from 'jspdf';
import { AttendeeRecord } from '../types';

/**
 * Downloads the SVG badge directly as an SVG vector file.
 */
export function exportBadgeAsSvg(svgElement: SVGSVGElement, filename: string): void {
  try {
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Ensure XML namespaces
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, source], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${filename}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  } catch (err) {
    console.error('Error exporting SVG:', err);
    throw new Error('Failed to export SVG file');
  }
}

/**
 * Renders SVG to a high-resolution Canvas and exports crisp 300DPI-equivalent PNG.
 */
export async function exportBadgeAsPng(
  svgElement: SVGSVGElement,
  filename: string,
  scale = 3
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const width = 450;
        const height = 700;

        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas 2D context'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) {
            reject(new Error('Failed to create PNG blob'));
            return;
          }

          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(pngUrl);
          resolve();
        }, 'image/png');
      };

      image.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      image.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates a single print-ready PDF containing the high-res badge with printer trim marks.
 */
export async function exportBadgeAsPdf(
  svgElement: SVGSVGElement,
  filename: string,
  eventName: string,
  participantName: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.crossOrigin = 'anonymous';

      image.onload = () => {
        const width = 450;
        const height = 700;
        const scale = 3;

        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Could not get canvas context for PDF'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const imgData = canvas.toDataURL('image/png');
        URL.revokeObjectURL(url);

        // Standard ID badge 90mm x 140mm with 7.5mm print margin
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [105, 155]
        });

        const badgeWidth = 90;
        const badgeHeight = 140;
        const marginX = (105 - badgeWidth) / 2;
        const marginY = (155 - badgeHeight) / 2;

        pdf.setFontSize(7);
        pdf.setTextColor(100, 116, 139);
        pdf.text(
          `BadgeForge AI · ${eventName || 'Event Badge'} · Holder: ${participantName || 'Delegate'}`,
          7.5,
          5
        );

        pdf.addImage(imgData, 'PNG', marginX, marginY, badgeWidth, badgeHeight);

        // Trim marks
        pdf.setDrawColor(148, 163, 184);
        pdf.setLineWidth(0.3);

        pdf.line(marginX - 3, marginY, marginX, marginY);
        pdf.line(marginX, marginY - 3, marginX, marginY);

        pdf.line(marginX + badgeWidth, marginY, marginX + badgeWidth + 3, marginY);
        pdf.line(marginX + badgeWidth, marginY - 3, marginX + badgeWidth, marginY);

        pdf.line(marginX - 3, marginY + badgeHeight, marginX, marginY + badgeHeight);
        pdf.line(marginX, marginY + badgeHeight, marginX, marginY + badgeHeight + 3);

        pdf.line(marginX + badgeWidth, marginY + badgeHeight, marginX + badgeWidth + 3, marginY + badgeHeight);
        pdf.line(marginX + badgeWidth, marginY + badgeHeight, marginX + badgeWidth, marginY + badgeHeight + 3);

        pdf.save(`${filename}.pdf`);
        resolve();
      };

      image.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };

      image.src = url;
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Generates a multi-page combined PDF pass sheet from a roster of validated attendees.
 */
export async function exportBatchPdf(
  baseSvgElement: SVGSVGElement,
  attendees: AttendeeRecord[],
  eventName: string
): Promise<void> {
  if (attendees.length === 0) return;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 155]
  });

  const width = 450;
  const height = 700;
  const scale = 2.5;

  const badgeWidth = 90;
  const badgeHeight = 140;
  const marginX = (105 - badgeWidth) / 2;
  const marginY = (155 - badgeHeight) / 2;

  // Rasterize base SVG representation
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(baseSvgElement);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (err) => reject(err);
    image.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width * scale;
  canvas.height = height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    URL.revokeObjectURL(url);
    throw new Error('Canvas 2D context unavailable');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const baseImgData = canvas.toDataURL('image/png');
  URL.revokeObjectURL(url);

  // Build PDF pages for each attendee
  for (let i = 0; i < attendees.length; i++) {
    const att = attendees[i];
    if (i > 0) {
      pdf.addPage([105, 155], 'portrait');
    }

    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `BadgeForge Batch (${i + 1}/${attendees.length}) · ${eventName || 'Event Pass'} · ${att.participantName}`,
      7.5,
      5
    );

    pdf.addImage(baseImgData, 'PNG', marginX, marginY, badgeWidth, badgeHeight);

    // Overlay attendee dynamic credentials cleanly in vector text on PDF
    pdf.setFontSize(10);
    pdf.setTextColor(248, 250, 252);
    // Draw trim marks
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.3);
    pdf.line(marginX - 3, marginY, marginX, marginY);
    pdf.line(marginX, marginY - 3, marginX, marginY);
    pdf.line(marginX + badgeWidth, marginY, marginX + badgeWidth + 3, marginY);
    pdf.line(marginX + badgeWidth, marginY - 3, marginX + badgeWidth, marginY);
    pdf.line(marginX - 3, marginY + badgeHeight, marginX, marginY + badgeHeight);
    pdf.line(marginX, marginY + badgeHeight, marginX, marginY + badgeHeight + 3);
    pdf.line(marginX + badgeWidth, marginY + badgeHeight, marginX + badgeWidth + 3, marginY + badgeHeight);
    pdf.line(marginX + badgeWidth, marginY + badgeHeight, marginX + badgeWidth, marginY + badgeHeight + 3);
  }

  const safeTitle = (eventName || 'BadgeForge_Batch').replace(/[^a-zA-Z0-9_-]/g, '_');
  pdf.save(`${safeTitle}_Attendee_Passes_${attendees.length}.pdf`);
}

'use client';
import React, { useState, useEffect } from "react";
import EpicGallery from "./EpicGallery";
import { getEPICImagesByDate } from "../lib/api/epic";

export default function EpicGalleryWrapper({ availableDates, defaultDate }: { availableDates: any[], defaultDate: string }) {
  // Ensure availableDates is an array of strings
  const dateStrings = availableDates.map((d: any) => typeof d === 'string' ? d : d.date);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!selectedDate) return;
    setLoading(true);
    setError(undefined);
    getEPICImagesByDate(selectedDate)
      .then(setImages)
      .catch(() => setError("Could not load images for this date."))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <EpicGallery
      availableDates={dateStrings}
      selectedDate={selectedDate}
      onDateChange={setSelectedDate}
      images={images}
      loading={loading}
      error={error}
    />
  );
} 
package com.example.GeminiProject.Model;

import com.example.GeminiProject.Enum.ColorType;
import com.example.GeminiProject.Enum.FileQuality;
import com.example.GeminiProject.Enum.FileType;
import com.example.GeminiProject.Repository.DataProcessingRepository;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import java.util.Optional;

@Entity
public class DataProcessing {
    @Id
    private String dataProcessingID;

    private String name;

    @Enumerated(EnumType.STRING)
    private FileType fileType;

    @Enumerated(EnumType.STRING)
    private FileQuality fileQuality;

    @Enumerated(EnumType.STRING)
    private ColorType colorType;

    private double contrast;
    private double brightness;
    private double saturation;
    private double highlights;
    private double exposure;
    private double shadows;
    private double whites;
    private double blacks;
    private double luminance;
    private double hue;

    public DataProcessing() {
        this.dataProcessingID = "";
        this.name = "";
        this.fileType = FileType.PNG;
        this.fileQuality = FileQuality.Low;
        this.colorType = ColorType.BlackAndWhite;
        this.contrast = 0;
        this.brightness = 0;
        this.saturation = 0;
        this.highlights = 0;
        this.exposure = 0;
        this.shadows = 0;
        this.whites = 0;
        this.blacks = 0;
        this.luminance = 0;
        this.hue = 0;
    }

    public DataProcessing(String dataProcessingID, String name,  FileType fileType, FileQuality fileQuality, ColorType colorType, double contrast, double brightness, double saturation, double highlights, double exposure, double shadows, double whites, double blacks, double luminance, double hue) {
        this.dataProcessingID = dataProcessingID;
        this.name = name;
        this.fileType = fileType;
        this.fileQuality = fileQuality;
        this.colorType = colorType;
        this.contrast = contrast;
        this.brightness = brightness;
        this.saturation = saturation;
        this.highlights = highlights;
        this.exposure = exposure;
        this.shadows = shadows;
        this.whites = whites;
        this.blacks = blacks;
        this.luminance = luminance;
        this.hue = hue;
    }

    public String getDataProcessingID() {
        return dataProcessingID;
    }
    public String getName() {
        return name;
    }
    public FileType getFileType() {
        return fileType;
    }
    public FileQuality getFileQuality() {
        return fileQuality;
    }
    public ColorType getColorType() {
        return colorType;
    }
    public double getContrast() {
        return contrast;
    }
    public double getBrightness() {
        return brightness;
    }
    public double getSaturation() {
        return saturation;
    }
    public double getHighlights() {
        return highlights;
    }
    public double getExposure() {
        return exposure;
    }
    public double getShadows() {
        return shadows;
    }
    public double getWhites() {
        return whites;
    }
    public double getBlacks() {
        return blacks;
    }
    public double getLuminance() {
        return luminance;
    }
    public double getHue() {
        return hue;
    }

    public void setDataProcessingID(String dataProcessingID) {
        this.dataProcessingID = dataProcessingID;
    }
    public void setName(String name) {
        this.name = name;
    }
    public void setFileType(FileType fileType) {
        this.fileType = fileType;
    }
    public void setFileQuality(FileQuality fileQuality) {
        this.fileQuality = fileQuality;
    }
    public void setColorType(ColorType colorType) {
        this.colorType = colorType;
    }
    public void setContrast(double contrast) {
        this.contrast = contrast;
    }
    public void setBrightness(double brightness) {
        this.brightness = brightness;
    }
    public void setSaturation(double saturation) {
        this.saturation = saturation;
    }
    public void setHighlights(double highlights) {
        this.highlights = highlights;
    }
    public void setExposure(double exposure) {
        this.exposure = exposure;
    }
    public void setShadows(double shadows) {
        this.shadows = shadows;
    }
    public void setWhites(double whites) {
        this.whites = whites;
    }
    public void setBlacks(double blacks) {
        this.blacks = blacks;
    }
    public void setLuminance(double luminance) {
        this.luminance = luminance;
    }
    public void setHue(double hue) {
        this.hue = hue;
    }
    
    public static String generateDataProcessingId(DataProcessingRepository dataProcessingRepository) {
        Optional<String> maxIdOpt = dataProcessingRepository.findMaxDataProcessingId();
        
        int nextId = 1;
        if (maxIdOpt.isPresent()) {
            String maxId = maxIdOpt.get();
            String numId = maxId.replaceAll("[^0-9]", "");
            
            if (!numId.isEmpty()) {
                nextId = Integer.parseInt(numId) + 1;
            }
        }
        
        String prefix = "dp-";
        return prefix + String.format("%03d", nextId);
    }
}

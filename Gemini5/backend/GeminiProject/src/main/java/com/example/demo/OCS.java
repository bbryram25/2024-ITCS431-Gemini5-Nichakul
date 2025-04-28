// Source code is decompiled from a .class file using FernFlower decompiler.
package com.example.demo;

import edu.gemini.app.ocs.model.AstronomicalData;
import edu.gemini.app.ocs.model.DataProcRequirement;
import edu.gemini.app.ocs.model.ObservingProgram;
import edu.gemini.app.ocs.model.ObservingProgramConfigs;
import edu.gemini.app.ocs.model.ObservingProgramConfigs.CalibrationUnit;
import edu.gemini.app.ocs.model.ObservingProgramConfigs.FoldMirrorType;
import edu.gemini.app.ocs.model.ObservingProgramConfigs.LightType;
import edu.gemini.app.ocs.model.SciencePlan;
import edu.gemini.app.ocs.model.SciencePlan.STATUS;
import edu.gemini.app.ocs.model.SciencePlan.TELESCOPELOC;
import edu.gemini.app.ocs.model.StarSystem;
import edu.gemini.app.ocs.model.StarSystem.CONSTELLATIONS;
import edu.gemini.app.ocs.model.TelePositionPair;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;



public class OCS {
   private static ArrayList<SciencePlan> sciencePlans = new ArrayList();
   private static int MAX_TELE_POSITION_PAIRS = 5;
   private static String connectdb = "jdbc:h2:file:C:/Users/ASUS/Documents/GitHub/2024-ITCS431-Gemini5/Gemini5/backend/GeminiProject/ocs";

   public OCS() {
      this.populateSciencePlans();
   }

   public OCS(boolean createMockData) {
      if (createMockData) {
         this.H2GenFirstTimeDB();
         this.populateSciencePlans();
      }

   }

   private void populateSciencePlans() {
      this.getSciencePlansFromDB();
   }

   private void checkAndUpdateStatus() {
   }

   public ArrayList<SciencePlan> getAllSciencePlans() {
      this.getSciencePlansFromDB();
      this.checkAndUpdateStatus();
      return sciencePlans;
   }

   private StarSystem.CONSTELLATIONS getStarSystemByStarName(String name) {
      StarSystem.CONSTELLATIONS[] starsystem = CONSTELLATIONS.values();
      StarSystem.CONSTELLATIONS[] var3 = starsystem;
      int var4 = starsystem.length;

      for(int var5 = 0; var5 < var4; ++var5) {
         StarSystem.CONSTELLATIONS ss = var3[var5];
         if (ss.name() == name) {
            return ss;
         }
      }

      return null;
   }

   public SciencePlan getSciencePlanByNo(int planNo) {
      this.getSciencePlansFromDB();
      this.checkAndUpdateStatus();
      Iterator var2 = sciencePlans.iterator();

      SciencePlan sp;
      do {
         if (!var2.hasNext()) {
            return null;
         }

         sp = (SciencePlan)var2.next();
      } while(sp.getPlanNo() != planNo);

      return sp;
   }

   public String createSciencePlan(SciencePlan sp) {
      String[] oplists = this.insertSciencePlanToDB(sp);
      System.out.println(oplists[0]);
      System.out.println(oplists[1]);
      return oplists[0] + "/n" + oplists[1];
   }

   public String submitSciencePlan(SciencePlan sp) {
      SciencePlan.STATUS spSts = sp.getStatus();
      String op;
      if (spSts == STATUS.TESTED) {
         this.updateSciencePlanStatus(sp.getPlanNo(), STATUS.SUBMITTED);
         op = "Your science plan has been submitted.";
      } else {
         op = "Please test your science plan.";
      }

      return op;
   }

   private String[] insertSciencePlanToDB(SciencePlan sp) {
      String[] slists = new String[2];
      String spCreator = sp.getCreator();
      String spSubmitter = sp.getSubmitter();
      double spFunding = sp.getFundingInUSD();
      String spObjective = sp.getObjectives();
      StarSystem.CONSTELLATIONS spStarSystem = sp.getStarSystem();
      String spStartDate = null;
      String spEndDate = null;
      String errDateformat = null;
      Date chkSDate = null;
      Date chkEDate = null;
      spStartDate = sp.getStartDate();
      if (spStartDate != "-1") {
         try {
            chkSDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(spStartDate);
         } catch (ParseException var48) {
            var48.printStackTrace();
            errDateformat = "Date format must be 'dd/MM/yyyy HH:mm:ss'";
         }
      } else {
         errDateformat = "Date format must be 'dd/MM/yyyy HH:mm:ss";
      }

      spEndDate = sp.getEndDate();
      if (spEndDate != "-1") {
         try {
            chkEDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(spEndDate);
         } catch (ParseException var47) {
            var47.printStackTrace();
            errDateformat = "Date format must be 'dd/MM/yyyy HH:mm:ss'";
         }
      } else {
         errDateformat = "Date format must be 'dd/MM/yyyy HH:mm:ss";
      }

      SciencePlan.TELESCOPELOC spTelescopeLocation = sp.getTelescopeLocation();
      ArrayList<DataProcRequirement> ListDPR = sp.getDataProcRequirements();
      if (errDateformat == null) {
         int result = chkSDate.compareTo(chkEDate);
         if (result < 0) {
            String JDBC_DRIVER = "org.h2.Driver";
            String DB_URL = connectdb;
            String USER = "sa";
            String PASS = "";
            Connection conn = null;
            Statement stmt = null;

            try {
               Class.forName("org.h2.Driver");
               conn = DriverManager.getConnection(connectdb, "sa", "");
               stmt = conn.createStatement();
               String sql = "SELECT MAX(planNo) FROM masSciencePlan";
               ResultSet rs = stmt.executeQuery(sql);
               int curplanNo = 0;
               if (rs.next()) {
                  curplanNo = rs.getInt(1);
                  ++curplanNo;
               }

               if (spFunding >= 0.0) {
                  sql = " INSERT INTO MASSCIENCEPLAN VALUES (" + curplanNo + ",'" + spCreator + "','" + spSubmitter + "'," + spFunding + ",'" + spObjective + "','" + String.valueOf(spStarSystem) + "','" + spStartDate + "','" + spEndDate + "','" + String.valueOf(spTelescopeLocation) + "','SAVED' );";
                  stmt.executeUpdate(sql);
                  Iterator var26 = ListDPR.iterator();

                  while(var26.hasNext()) {
                     DataProcRequirement drp = (DataProcRequirement)var26.next();
                     sql = " INSERT INTO trDataProcRequirement VALUES ( " + curplanNo + ",'" + drp.getFileType() + "','" + drp.getFileQuality() + "','" + drp.getColorType() + "'," + drp.getContrast() + "," + drp.getBrightness() + "," + drp.getSaturation() + "," + drp.getHighlights() + "," + drp.getExposure() + "," + drp.getShadows() + "," + drp.getWhites() + "," + drp.getBlacks() + "," + drp.getLuminance() + "," + drp.getHue() + " );";
                     stmt.executeUpdate(sql);
                  }

                  ArrayList<String> Astrodatalist = this.getAstronomicalList();
                  int seq = 1;

                  for(int i = 0; i < Astrodatalist.size(); ++i) {
                     String AstroPath = (String)Astrodatalist.get(i);
                     sql = "INSERT INTO masAstronomicalData VALUES(" + curplanNo + "," + seq + ",'" + AstroPath + "');";
                     stmt.executeUpdate(sql);
                     ++seq;
                  }

                  sp.setPlanNo(curplanNo);
                  sp.setStatus(STATUS.SAVED);
                  sciencePlans.add(sp);
                  slists[0] = "planNo = " + String.valueOf(curplanNo);
                  slists[1] = "Your science plan has been saved./n";
               } else {
                  slists[0] = "-1";
                  slists[1] = "Funding cannot be negative./n";
               }
            } catch (SQLException var49) {
               slists[0] = "-1";
               slists[1] = var49.getMessage();
               var49.printStackTrace();
            } catch (Exception var50) {
               slists[0] = "-1";
               slists[1] = var50.getMessage();
               var50.printStackTrace();
            } finally {
               try {
                  if (stmt != null) {
                     stmt.close();
                  }
               } catch (SQLException var46) {
               }

               try {
                  if (conn != null) {
                     conn.close();
                  }
               } catch (SQLException var45) {
                  var45.printStackTrace();
               }

            }
         } else {
            slists[0] = "-1";
            slists[1] = "The start date must be before the end date/n";
         }
      } else {
         slists[0] = "-1";
         slists[1] = errDateformat + "/n";
      }

      return slists;
   }

   public boolean updateSciencePlanStatus(int planno, SciencePlan.STATUS stssp) {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      boolean var10;
      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         String var10000 = String.valueOf(stssp);
         sql = " UPDATE MASSCIENCEPLAN SET SPStatus = '" + var10000 + "' WHERE planNo = " + planno;
         stmt.executeUpdate(sql);
         stmt.close();
         conn.close();
         SciencePlan sp = this.getSciencePlanByNo(planno);
         boolean var11;
         if (sp != null) {
            sp.setStatus(stssp);
            System.out.println("Updated status of '" + String.valueOf(stssp) + "' successfully.../n");
            var11 = true;
            return var11;
         }

         System.out.println("Update status of '" + String.valueOf(stssp) + "' is unsuccessful...");
         System.out.println("Not found planNo: " + planno + "/n");
         var11 = false;
         return var11;
      } catch (SQLException var30) {
         var30.printStackTrace();
         System.out.println("Update Status '" + String.valueOf(stssp) + "' failed.../n");
         var10 = false;
      } catch (Exception var31) {
         var31.printStackTrace();
         System.out.println("Update Status '" + String.valueOf(stssp) + "' failed.../n");
         var10 = false;
         return var10;
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var29) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var28) {
            var28.printStackTrace();
         }

      }

      return var10;
   }

   public String testSciencePlan(SciencePlan sp) {
      System.out.println("/nSTART Testing.......");
      String[] r1 = this.testSelectedStarSystem(sp, 5L);
      String[] r2 = this.testImgProcessingConfig(sp, 5L);
      String[] r3 = this.testTelescopeLocation(sp, 5L);
      String[] r4 = this.testDuration(sp, 5L);
      String error;
      if (r1[0].equals("0") && r2[0].equals("0") && r3[0].equals("0") && r4[0].equals("0")) {
         this.updateSciencePlanStatus(sp.getPlanNo(), STATUS.TESTED);
         error = "/nTEST RESULTS:/n" + r1[1] + "/n" + r2[1] + "/n" + r3[1] + "/n" + r4[1] + "/n";
         return error;
      } else {
         error = "/nTEST RESULTS:/n" + r1[1] + "/n" + r2[1] + "/n" + r3[1] + "/n" + r4[1] + "/n";
         return error;
      }
   }

   private String[] testSelectedStarSystem(SciencePlan sp, long delay) {
      String[] results = new String[]{"", "Selected star system: Testing..."};
      System.out.println(results[1]);

      try {
         TimeUnit.SECONDS.sleep(delay);
      } catch (InterruptedException var18) {
         var18.printStackTrace();
      }

      SciencePlan.STATUS spSts = sp.getStatus();
      if (spSts == STATUS.SAVED) {
         StarSystem.CONSTELLATIONS starsystem = sp.getStarSystem();
         StarSystem.CONSTELLATIONS spStarsystem = this.getStarSystemByStarName(String.valueOf(starsystem));
         int getmonth = spStarsystem.getmonth();
         Date chkSDate = null;
         Date chkEDate = null;
         int sMonth = 0;
         int eMonth = 0;
         String spStartDate = sp.getStartDate();

         try {
            chkSDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(spStartDate);
            Calendar cal = Calendar.getInstance();
            cal.setTime(chkSDate);
            sMonth = cal.get(2) + 1;
         } catch (ParseException var17) {
            var17.printStackTrace();
         }

         String spEndDate = sp.getEndDate();

         try {
            chkEDate = (new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(spEndDate);
            Calendar cal = Calendar.getInstance();
            cal.setTime(chkEDate);
            eMonth = cal.get(2) + 1;
         } catch (ParseException var16) {
            var16.printStackTrace();
         }

         if (getmonth >= sMonth && getmonth <= eMonth) {
            results[0] = "0";
            results[1] = "testSelectedStarSystem: OK";
            return results;
         } else {
            results[0] = "-1";
            results[1] = "testSelectedStarSystem: ERROR: The selected star system is not within the observation duration that you specified. Please check.";
            return results;
         }
      } else {
         results[0] = "-1";
         results[1] = "testSelectedStarSystem: ERROR: STATUS must be SUBMITTED. Please check.";
         return results;
      }
   }

   private String[] testTelescopeLocation(SciencePlan sp, long delay) {
      String testName = "Telescope Location";
      String[] results = new String[]{"", testName + ": Testing..."};
      System.out.println(results[1]);

      try {
         TimeUnit.SECONDS.sleep(delay);
      } catch (InterruptedException var13) {
         var13.printStackTrace();
      }

      SciencePlan.STATUS spSts = sp.getStatus();
      SciencePlan.TELESCOPELOC telescopeloc = sp.getTelescopeLocation();
      String loc = null;
      if (String.valueOf(telescopeloc) == "HAWAII") {
         loc = "N";
      } else {
         loc = "S";
      }

      StarSystem.CONSTELLATIONS starsystem = sp.getStarSystem();
      StarSystem.CONSTELLATIONS spStarsystem = this.getStarSystemByStarName(String.valueOf(starsystem));
      String getquadrantloc = String.valueOf(spStarsystem.getQuadrant()).substring(0, 2);
      int resultcompare = getquadrantloc.compareTo("NQ");
      if (resultcompare == 0) {
         getquadrantloc = "N";
      } else {
         getquadrantloc = "S";
      }

      if (spSts == STATUS.SAVED) {
         if (loc == getquadrantloc) {
            results[0] = "0";
            results[1] = testName + ": OK";
         } else {
            results[0] = "-1";
            results[1] = testName + ": ERROR: This telescope does not match with the quadrant of the star system. Please check.";
         }
      } else {
         results[0] = "-1";
         results[1] = testName + ": ERROR: STATUS must be SUBMITTED. Please check.";
      }

      return results;
   }

   private String[] testImgProcessingConfig(SciencePlan sp, long delay) {
      String testName = "Image processing configuration";
      String[] results = new String[]{"", testName + ": Testing..."};
      System.out.println(results[1]);

      try {
         TimeUnit.SECONDS.sleep(delay);
      } catch (InterruptedException var31) {
         var31.printStackTrace();
      }

      SciencePlan.STATUS spSts = sp.getStatus();
      ArrayList<DataProcRequirement> dpr = sp.getDataProcRequirements();
      String dprfileType = null;
      String dprfileQuality = null;
      String dprcolorType = null;
      double opExposure = 0.0;
      double opContrast = 0.0;
      double opHighlights = 0.0;
      double opShadows = 0.0;
      double opWhites = 0.0;
      double opBlacks = 0.0;
      double opBrightness = 0.0;
      double opSaturation = 0.0;
      double opLuminance = 0.0;
      double opHue = 0.0;
      if (spSts == STATUS.SAVED) {
         dprfileType = ((DataProcRequirement)dpr.get(0)).getFileType();
         dprfileQuality = ((DataProcRequirement)dpr.get(0)).getFileQuality();
         dprcolorType = ((DataProcRequirement)dpr.get(0)).getColorType();
         opExposure = ((DataProcRequirement)dpr.get(0)).getExposure();
         opContrast = ((DataProcRequirement)dpr.get(0)).getContrast();
         opHighlights = ((DataProcRequirement)dpr.get(0)).getHighlights();
         opShadows = ((DataProcRequirement)dpr.get(0)).getShadows();
         opWhites = ((DataProcRequirement)dpr.get(0)).getWhites();
         opBlacks = ((DataProcRequirement)dpr.get(0)).getBlacks();
         opBrightness = ((DataProcRequirement)dpr.get(0)).getBrightness();
         opSaturation = ((DataProcRequirement)dpr.get(0)).getSaturation();
         opLuminance = ((DataProcRequirement)dpr.get(0)).getLuminance();
         opHue = ((DataProcRequirement)dpr.get(0)).getHue();
         if (!dprfileType.equals("PNG") && !dprfileType.equals("JPEG") && !dprfileType.equals("RAW")) {
            results[0] = "-1";
            results[1] = testName + ": ERROR: Incorrect file type. Please check.";
            return results;
         } else if (!dprfileQuality.equals("Low") && !dprfileQuality.equals("Fine")) {
            results[0] = "-1";
            results[1] = testName + ": ERROR: Incorrect file quality. Please check.";
            return results;
         } else if (!dprcolorType.equals("B&W mode") && !dprcolorType.equals("Color mode")) {
            results[0] = "-1";
            results[1] = testName + ": ERROR: Incorrect color type. Please check.";
            return results;
         } else if (opExposure >= 0.0 && opExposure <= 50.0) {
            if (opContrast >= 0.0 && opContrast <= 5.0) {
               if (opHighlights >= 0.0 && opHighlights <= 50.0) {
                  if (opShadows >= 0.0 && opShadows <= 50.0) {
                     if (opWhites >= 0.0 && opWhites <= 50.0) {
                        if (opBlacks >= 0.0 && opBlacks <= 50.0) {
                           if (opBrightness >= 0.0 && opBrightness <= 50.0) {
                              if (opSaturation >= 0.0 && opSaturation <= 50.0) {
                                 if (opLuminance >= 0.0 && opLuminance <= 50.0) {
                                    if (opHue >= 0.0 && opHue <= 50.0) {
                                       results[0] = "0";
                                       results[1] = testName + ": OK";
                                       return results;
                                    } else {
                                       results[0] = "-1";
                                       results[1] = testName + ": ERROR: Hue is out of range. Please check.";
                                       return results;
                                    }
                                 } else {
                                    results[0] = "-1";
                                    results[1] = testName + ": ERROR: Luminance is out of range. Please check.";
                                    return results;
                                 }
                              } else {
                                 results[0] = "-1";
                                 results[1] = testName + ": ERROR: Saturation is out of range. Please check.";
                                 return results;
                              }
                           } else {
                              results[0] = "-1";
                              results[1] = testName + ": ERROR: Brightness is out of range. Please check.";
                              return results;
                           }
                        } else {
                           results[0] = "-1";
                           results[1] = testName + ": ERROR: Blacks is out of range. Please check.";
                           return results;
                        }
                     } else {
                        results[0] = "-1";
                        results[1] = testName + ": ERROR: Whites is out of range. Please check.";
                        return results;
                     }
                  } else {
                     results[0] = "-1";
                     results[1] = testName + ": ERROR: Shadows is out of range. Please check.";
                     return results;
                  }
               } else {
                  results[0] = "-1";
                  results[1] = testName + ": ERROR: Highlights is out of range. Please check.";
                  return results;
               }
            } else {
               results[0] = "-1";
               results[1] = testName + ": ERROR: Contrast is out of range. Please check.";
               return results;
            }
         } else {
            results[0] = "-1";
            results[1] = testName + ": ERROR: Exposure is out of range. Please check.";
            return results;
         }
      } else {
         results[0] = "-1";
         results[1] = testName + ": ERROR: STATUS of the science plan must be SUBMITTED to be able to test. Please check.";
         return results;
      }
   }

   private String[] testDuration(SciencePlan sp, long delay) {
      String testName = "Duration";
      String[] results = new String[]{"", testName + ": Testing..."};
      System.out.println(results[1]);

      try {
         TimeUnit.SECONDS.sleep(delay);
      } catch (InterruptedException var37) {
         var37.printStackTrace();
      }

      SciencePlan.STATUS spSts = sp.getStatus();
      if (spSts == STATUS.SAVED) {
         results[0] = "";
         results[1] = "";
         String JDBC_DRIVER = "org.h2.Driver";
         String DB_URL = connectdb;
         String USER = "sa";
         String PASS = "";
         Connection conn = null;
         Statement stmt = null;

         String[] var14;
         try {
            Class.forName("org.h2.Driver");
            conn = DriverManager.getConnection(connectdb, "sa", "");
            stmt = conn.createStatement();
            String spStartDate = sp.getStartDate();
            String spEndDate = sp.getEndDate();
            SciencePlan.TELESCOPELOC spTelescopeLocation = sp.getTelescopeLocation();
            String sql = "";
            sql = "SELECT * FROM masSciencePlan WHERE SPStatus IN ('TESTED','RUNNING','VALIDATED') AND telescopeLocation = '" + String.valueOf(spTelescopeLocation) + "'  AND ((endDate >= '" + spStartDate + "' and startDate <= '" + spStartDate + "') OR (endDate >= '" + spEndDate + "' and startDate <= '" + spEndDate + "'))";
            stmt.executeQuery(sql);
            ResultSet rs = stmt.executeQuery(sql);
            rs.last();
            int inputplanno = sp.getPlanNo();
            if (rs.getRow() > 0) {
               new SciencePlan();
               SciencePlan sperr = this.getSciencePlanByNo(rs.getInt("planNo"));
               results[0] = "-1";
               results[1] = testName + ": Duration Plan Number " + inputplanno + " has problem : {planNo:" + sperr.getPlanNo() + ", Star:" + String.valueOf(sperr.getStarSystem()) + ", StartDate:" + sperr.getStartDate() + ", EndDate:" + sperr.getEndDate() + ", Status:" + String.valueOf(sperr.getStatus()) + "}";
            } else {
               results[0] = "0";
               results[1] = "testDuration: OK.";
            }

            String[] var42 = results;
            return var42;
         } catch (SQLException var38) {
            var38.printStackTrace();
            results[0] = "-1";
            results[1] = testName + ": ERROR: Failed.";
            var14 = results;
         } catch (Exception var39) {
            var39.printStackTrace();
            results[0] = "-1";
            results[1] = testName + ": ERROR: Failed.";
            var14 = results;
            return var14;
         } finally {
            try {
               if (stmt != null) {
                  stmt.close();
               }
            } catch (SQLException var36) {
            }

            try {
               if (conn != null) {
                  conn.close();
               }
            } catch (SQLException var35) {
               var35.printStackTrace();
            }

         }

         return var14;
      } else {
         results[0] = "-1";
         results[1] = testName + ": ERROR: STATUS must be SUBMITTED.";
         return results;
      }
   }

   private void getSciencePlansFromDB() {
      sciencePlans.clear();
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = "SELECT * FROM masSciencePlan";
         ResultSet rs = stmt.executeQuery(sql);

         while(rs.next()) {
            SciencePlan sp1 = new SciencePlan();
            sp1.setPlanNo(rs.getInt("planNo"));
            sp1.setCreator(rs.getString("creator"));
            sp1.setSubmitter(rs.getString("submitter"));
            sp1.setFundingInUSD(rs.getDouble("fundingInUSD"));
            sp1.setObjectives(rs.getString("objectives"));
            sp1.setStarSystem(CONSTELLATIONS.valueOf(rs.getString("starSystem")));
            String sDate = rs.getString("startDate");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat sdf2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            sDate = sdf2.format(sdf.parse(sDate));
            sp1.setStartDate(sDate);
            sp1.setTelescopeLocation(TELESCOPELOC.valueOf(rs.getString("telescopeLocation")));
            String eDate = rs.getString("endDate");
            new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            SimpleDateFormat edf2 = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
            eDate = edf2.format(sdf.parse(eDate));
            sp1.setEndDate(eDate);
            sp1.setStatus(STATUS.valueOf(rs.getString("SPStatus")));
            String sql1 = "SELECT * FROM trDataProcRequirement WHERE planNo = " + rs.getInt("planNo");
            stmt1 = conn.createStatement();
            ResultSet rs1 = stmt1.executeQuery(sql1);

            while(rs1.next()) {
               DataProcRequirement dpr1 = new DataProcRequirement(rs1.getString("fileType"), rs1.getString("fileQuality"), rs1.getString("colorType"), rs1.getDouble("contrast"), rs1.getDouble("brightness"), rs1.getDouble("saturation"), rs1.getDouble("highlights"), rs1.getDouble("exposure"), rs1.getDouble("shadows"), rs1.getDouble("whites"), rs1.getDouble("blacks"), rs1.getDouble("luminance"), rs1.getDouble("hue"));
               sp1.setDataProcRequirements(dpr1);
            }

            stmt1.close();
            sciencePlans.add(sp1);
         }

         stmt.close();
         conn.close();
      } catch (SQLException var35) {
         var35.printStackTrace();
      } catch (Exception var36) {
         var36.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var34) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var33) {
            var33.printStackTrace();
         }

      }

   }

   public void deleteAllSciencePlans() {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = " DELETE FROM masSciencePlan; ";
         stmt.executeUpdate(sql);
         sql = " DELETE FROM trDataProcRequirement; ";
         stmt.executeUpdate(sql);
      } catch (SQLException var23) {
         var23.printStackTrace();
      } catch (Exception var24) {
         var24.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var22) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var21) {
            var21.printStackTrace();
         }

      }

   }

   public boolean deleteSciencePlanByNo(int planNo) {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = " DELETE FROM masSciencePlan WHERE planNo = " + planNo + ";";
         stmt.executeUpdate(sql);
         sql = "DELETE FROM trDataProcRequirement WHERE planNo = " + planNo + ";";
         stmt.executeUpdate(sql);
         conn.close();
         boolean var9 = true;
         return var9;
      } catch (SQLException var26) {
         var26.printStackTrace();
      } catch (Exception var27) {
         var27.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var25) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var24) {
            var24.printStackTrace();
         }

      }

      return false;
   }

   public String addUnavailableDate(Date datevalue) {
      String msgtext = "";
      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
      String undate = formatter.format(datevalue);
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "SELECT * FROM masUnavailableDates WHERE unavailabledates = '" + undate + "'";
         ResultSet rs = stmt.executeQuery(sql);
         int dateid = 0;
         if (rs.next()) {
            dateid = rs.getInt("id");
         }

         if (dateid == 0) {
            sql = " INSERT INTO masUnavailableDates(unavailabledates) VALUES ('" + undate + "');";
            stmt.executeUpdate(sql);
            msgtext = "Your unavailable date has been saved./n";
         } else {
            msgtext = "Unavailable date is exist./n";
         }

         conn.close();
      } catch (SQLException var29) {
         msgtext = var29.getMessage();
         var29.printStackTrace();
      } catch (Exception var30) {
         msgtext = var30.getMessage();
         var30.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var28) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var27) {
            var27.printStackTrace();
         }

      }

      return msgtext;
   }

   public String deleteUnavailableDate(Date datevalue) {
      String msgtext = "";
      SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
      String undate = formatter.format(datevalue);
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "SELECT * FROM masUnavailableDates WHERE unavailabledates = '" + undate + "'";
         ResultSet rs = stmt.executeQuery(sql);
         int dateid = 0;
         if (rs.next()) {
            dateid = rs.getInt("id");
         }

         if (dateid > 0) {
            sql = " DELETE FROM masUnavailableDates WHERE unavailabledates = '" + undate + "'";
            stmt.executeUpdate(sql);
            msgtext = "Your unavailable date has been deleted./n";
         } else {
            msgtext = "Your unavailable date is not exist./n";
         }

         conn.close();
      } catch (SQLException var29) {
         msgtext = var29.getMessage();
         var29.printStackTrace();
      } catch (Exception var30) {
         msgtext = var30.getMessage();
         var30.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var28) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var27) {
            var27.printStackTrace();
         }

      }

      return msgtext;
   }

   public ArrayList<Date> getAllObservationSchedule() {
      ArrayList<Date> dates = this.getObservationScheduleFromDB();
      if (dates.isEmpty()) {
         System.out.println("Observation Schedule is Empty. Please add your Observation Schedule.");
      }

      return dates;
   }

   private ArrayList<Date> getObservationScheduleFromDB() {
      ArrayList<Date> unavailabledatelist = new ArrayList();
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = "SELECT * FROM masUnavailableDates";
         ResultSet rs = stmt.executeQuery(sql);

         while(rs.next()) {
            Date unavailabledates = rs.getDate("unavailabledates");
            unavailabledatelist.add(unavailabledates);
         }

         stmt.close();
         conn.close();
      } catch (SQLException var27) {
         var27.printStackTrace();
      } catch (Exception var28) {
         var28.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var26) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var25) {
            var25.printStackTrace();
         }

      }

      return unavailabledatelist;
   }

   private void H2GenFirstTimeDB() {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         System.out.println("Connecting to database...");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         System.out.println("Connected database successfully...");
         stmt = conn.createStatement();
         String sql = "";
         sql = " DROP TABLE IF EXISTS masSciencePlan; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS trDataProcRequirement; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS masObservingProgram; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS masTelePositionPair; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS masUnavailableDates; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS opTable; ";
         stmt.executeUpdate(sql);
         sql = " DROP TABLE IF EXISTS masAstronomicalData; ";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS masSciencePlan  (planNo INT not NULL,  creator VARCHAR(100),  submitter VARCHAR(100),  fundingInUSD Double,  objectives VARCHAR(255),  starSystem VARCHAR(50),  startDate DateTime ,  endDate DateTime ,  telescopeLocation VARCHAR(50), SPStatus VARCHAR(50), PRIMARY KEY ( planNo ))";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS trDataProcRequirement  (planNo INT not NULL,  fileType VARCHAR(100),  fileQuality VARCHAR(100),  colorType VARCHAR(100),  contrast Double,  brightness Double,  saturation Double,  highlights Double,  exposure Double,  shadows Double,  whites Double,  blacks Double,  luminance Double,  hue Double  )";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS masObservingProgram  (planNo INT not NULL,  geminiLocation VARCHAR(10),  opticsPrimary VARCHAR(20),  fStop Double,  opticsSecondaryRMS Double,  scienceFoldMirrorDegree Double,  scienceFoldMirrorType VARCHAR(50),  moduleContent INT ,  calibrationUnit VARCHAR(10), lightType VARCHAR(50), validationStatus BOOLEAN, PRIMARY KEY ( planNo ))";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS masTelePositionPair  (planNo INT not NULL,  direction Double,  degree Double )";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS masUnavailableDates  (id INT not NULL auto_increment,  unavailabledates Date,  PRIMARY KEY ( id ) )";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS opTable  (id INT not NULL auto_increment,  physicalDevice VARCHAR(255),  PRIMARY KEY ( id ) )";
         stmt.executeUpdate(sql);
         sql = " CREATE TABLE IF NOT EXISTS masAstronomicalData  (planNo INT not NULL,  seq INT,  imgURL VARCHAR(200),  )";
         stmt.executeUpdate(sql);
         sql = " INSERT INTO masSciencePlan VALUES ( 1,'John Doe','John Doe',1000,'1. To explore Neptune./n2. To collect astronomical data for future research.','Andromeda','2021-04-15 09:00:00','2021-04-15 10:00:00','HAWAII','SAVED' );  INSERT INTO trDataProcRequirement VALUES ( 1,'PNG','Fine','B&W mode',20,0,0,10,15,5,7,10,0,0 );  INSERT INTO masObservingProgram VALUES(1,'N','GNZ',2.4,16.0,37,'CASSEGRAIN_FOCUS' ,3,'Xenon','CerroPachonSkyEmission',False); INSERT INTO masTelePositionPair VALUES(1,135,44); INSERT INTO masTelePositionPair VALUES(1,90,65); INSERT INTO masTelePositionPair VALUES(1,210,35); INSERT INTO masSciencePlan VALUES ( 2,'Jane Dunn','Andrew Griffin',2500,'1. To explore Mars./n2. To collect astronomical data for future research.','Antlia','2021-05-15 13:00:00','2021-05-15 15:00:00','CHILE','SAVED' ); INSERT INTO trDataProcRequirement VALUES ( 2,'JPEG','Low','Color mode',11,10,5,0,7,0,0,0,10,8 ); INSERT INTO masObservingProgram VALUES(2,'S','GSZ',5.5,12.0,40,'REFLECTIVE_CONVERGING_BEAM' ,1,'Argon','MaunaKeaSkyEmission',False); INSERT INTO masTelePositionPair VALUES(2,90,34); INSERT INTO masTelePositionPair VALUES(2,210,70);";
         stmt.executeUpdate(sql);
         ArrayList<String> Astrodatalist = this.getAstronomicalList();
         int seq = 1;

         for(int i = 0; i < Astrodatalist.size(); ++i) {
            String AstroPath = (String)Astrodatalist.get(i);
            sql = "INSERT INTO masAstronomicalData VALUES(1," + seq + ",'" + AstroPath + "');";
            stmt.executeUpdate(sql);
            sql = "INSERT INTO masAstronomicalData VALUES(2," + seq + ",'" + AstroPath + "');";
            stmt.executeUpdate(sql);
            ++seq;
         }

         stmt.close();
         conn.close();
      } catch (SQLException var27) {
         var27.printStackTrace();
      } catch (Exception var28) {
         var28.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var26) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var25) {
            var25.printStackTrace();
         }

      }

      System.out.println("Goodbye!");
   }

   public AstronomicalData getAstronomicalData(SciencePlan sp) throws IOException {
      return sp.getStatus() == STATUS.COMPLETE ? sp.retrieveAstroData(this.getAstronomicalDataFromDB(sp)) : null;
   }

   private ArrayList<String> getAstronomicalDataFromDB(SciencePlan sp) throws IOException {
      ArrayList<String> AstroList = new ArrayList();
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = "SELECT * FROM masAstronomicalData WHERE planNo = " + sp.getPlanNo();
         ResultSet rs = stmt.executeQuery(sql);

         while(rs.next()) {
            String Astrodata = rs.getString("imgURL");
            AstroList.add(Astrodata);
         }

         stmt.close();
         conn.close();
      } catch (SQLException var28) {
         var28.printStackTrace();
      } catch (Exception var29) {
         var29.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var27) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var26) {
            var26.printStackTrace();
         }

      }

      return AstroList;
   }

   public AstronomicalData removeAstronomicalData(SciencePlan sp, int index) throws IOException {
      new ArrayList();
      ArrayList<String> astroList = this.getAstronomicalDataFromDB(sp);

      try {
         astroList.remove(index);
         this.DeleteAstronomicalFromDB(sp.getPlanNo());
         String JDBC_DRIVER = "org.h2.Driver";
         String DB_URL = connectdb;
         String USER = "sa";
         String PASS = "";
         Connection conn = null;
         Statement stmt = null;
         Statement stmt1 = null;

         try {
            Class.forName("org.h2.Driver");
            conn = DriverManager.getConnection(connectdb, "sa", "");
            stmt = conn.createStatement();
            String sql = "";
            int seq = 1;

            for(int i = 0; i < astroList.size(); ++i) {
               String AstroPath = (String)astroList.get(i);
               sql = "INSERT INTO masAstronomicalData VALUES(" + sp.getPlanNo() + "," + seq + ",'" + AstroPath + "');";
               stmt.executeUpdate(sql);
               ++seq;
            }

            stmt.close();
            conn.close();
         } catch (SQLException var31) {
            var31.printStackTrace();
         } catch (Exception var32) {
            var32.printStackTrace();
         } finally {
            try {
               if (stmt != null) {
                  stmt.close();
               }
            } catch (SQLException var30) {
            }

            try {
               if (conn != null) {
                  conn.close();
               }
            } catch (SQLException var29) {
               var29.printStackTrace();
            }

         }
      } catch (Exception var34) {
         System.out.println(var34);
      }

      return sp.retrieveAstroData(this.getAstronomicalDataFromDB(sp));
   }

   private void DeleteAstronomicalFromDB(int planNo) {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = "DELETE FROM masAstronomicalData WHERE planNo = " + planNo;
         stmt.executeUpdate(sql);
         System.out.println("Your AstronomicalData has been deleted./n");
         stmt.close();
         conn.close();
      } catch (SQLException var25) {
         var25.printStackTrace();
      } catch (Exception var26) {
         var26.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var24) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var23) {
            var23.printStackTrace();
         }

      }

   }

   private ArrayList<String> getAstronomicalList() throws IOException {
      int noOfImages = this.randNum(6) + 4;
      ArrayList<String> AstronomicalList = new ArrayList();
      ArrayList<String> imageList = this.getListOfImages("references" + File.separator + "images.txt");

      for(int i = 0; i < noOfImages; ++i) {
         String selectedImgLoc = (String)imageList.remove(this.randNum(imageList.size()));
         AstronomicalList.add(selectedImgLoc);
      }

      return AstronomicalList;
   }

   private ArrayList<String> getListOfImages(String imageListFileLoc) throws IOException {
      ArrayList<String> imagePaths = new ArrayList();
      BufferedReader reader = new BufferedReader(new FileReader(imageListFileLoc));

      for(String line = reader.readLine(); line != null; line = reader.readLine()) {
         imagePaths.add(line);
      }

      reader.close();
      return imagePaths;
   }

   public String accessTelescopeLiveView() throws IOException {
      String strliveview = null;
      int ran = this.randNum(8) + 1;
      ArrayList<String> liveviewList = this.getListOfVideo("references" + File.separator + "liveview.txt");
      strliveview = (String)liveviewList.get(ran);
      return "LIVE VIEW: " + strliveview;
   }

   private ArrayList<String> getListOfVideo(String liveview) throws IOException {
      ArrayList<String> videopath = new ArrayList();
      BufferedReader reader = new BufferedReader(new FileReader(liveview));

      for(String line = reader.readLine(); line != null; line = reader.readLine()) {
         videopath.add(line);
      }

      reader.close();
      return videopath;
   }

   public String executeCommand(String command) {
      double lat = 100.0;
      double lon = 150.0;
      double step = 10.0;
      if (command.equals("GetVersion")) {
         return "2021.04.28_v1.0";
      } else {
         int ran;
         if (command.equals("GetStatus")) {
            ran = this.randNum(11) + 1;
            if (ran < 2) {
               ran = this.randNum(10) + 1;
               if (ran == 1) {
                  return "DOWN";
               } else if (ran == 2) {
                  return "BOOTED";
               } else if (ran == 3) {
                  return "CONFIGURING";
               } else if (ran == 4) {
                  return "CONFIGURED";
               } else if (ran == 5) {
                  return "INITIALIZING";
               } else if (ran == 6) {
                  return "MAINTENANCE";
               } else if (ran == 7) {
                  return "SIMULATION";
               } else if (ran == 8) {
                  return "DISABLED";
               } else {
                  return ran == 9 ? "SHUTDOWN" : "LOCKED";
               }
            } else {
               return "RUNNING";
            }
         } else if (command.equals("RunTest")) {
            ran = this.randNum(10) + 1;
            if (ran > 2) {
               return "OK";
            } else {
               return ran == 1 ? "BAD" : "WARNING";
            }
         } else if (command.equals("START")) {
            return "Starting the virtual telescope .../nTelescope is pointing to: " + lat + ": " + lon;
         } else if (command.equals("STOP")) {
            return "Stopping the virtual telescope ...";
         } else if (command.equals("UP")) {
            if (lat + step <= 90.0) {
               lat += step;
            }

            return "Telescope is pointing to: " + lat + ": " + lon;
         } else if (command.equals("DOWN")) {
            if (lat - step >= -90.0) {
               lat -= step;
            }

            return "Telescope is pointing to: " + lat + ": " + lon;
         } else if (command.equals("LEFT")) {
            if (lon + step <= 180.0) {
               lon += step;
            }

            return "Telescope is pointing to: " + lat + ": " + lon;
         } else if (command.equals("RIGHT")) {
            if (lon - step >= -180.0) {
               lon -= step;
            }

            return "Telescope is pointing to: " + lat + ": " + lon;
         } else if (command.equals("FOCUS")) {
            return "Auto focusing ...";
         } else {
            return command.equals("TAKE_PHOTO") ? "Taking a photo ..." : "ERROR: Wrong command. Please choose from the list of available commands (GetVersion, GetStatus, GetState, RunTest, START, UP, DOWN, LEFT, RIGHT, FOCUS, TAKE_PHOTO, STOP)";
         }
      }
   }

   private int randNum(int upperBound) {
      Random rand = new Random();
      return rand.nextInt(upperBound);
   }

   public String getConfigurations() {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      String sql1 = "SELECT * FROM opTable";

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         ResultSet rs = stmt.executeQuery(sql1);

         while(rs.next()) {
            System.out.print(rs.getInt("id") + ": ");
            System.out.println(rs.getString("physicalDevice"));
         }

         conn.close();
      } catch (ClassNotFoundException | SQLException var9) {
         var9.printStackTrace();
      }

      return "";
   }

   public boolean addConfiguration(String confFilePath) {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      String sql1 = "INSERT INTO opTable(physicalDevice) VALUES('" + confFilePath + "');";

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         stmt.executeUpdate(sql1);
         conn.close();
         return true;
      } catch (ClassNotFoundException | SQLException var10) {
         var10.printStackTrace();
         return false;
      }
   }

   public boolean removeConfiguration(int confNo) {
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = " DELETE FROM opTable WHERE id = " + confNo + ";";
         stmt.executeUpdate(sql);
         conn.close();
         return true;
      } catch (ClassNotFoundException | SQLException var9) {
         var9.printStackTrace();
         return true;
      }
   }

   public ObservingProgramConfigs.FoldMirrorType[] getFoldMirrorTypes() {
      return ObservingProgramConfigs.getFoldMirrorType();
   }

   public ObservingProgramConfigs.CalibrationUnit[] getCalibrationUnits() {
      return ObservingProgramConfigs.getCalibrationUnit();
   }

   public ObservingProgramConfigs.LightType[] getLightTypes() {
      return ObservingProgramConfigs.getLightType();
   }

   public ObservingProgram createObservingProgram(SciencePlan sp, String opticsPrimary, double fStop, double opticsSecondaryRMS, double scienceFoldMirrorDegree, ObservingProgramConfigs.FoldMirrorType scienceFoldMirrorType, int moduleContent, ObservingProgramConfigs.CalibrationUnit calibrationUnit, ObservingProgramConfigs.LightType lightType, TelePositionPair[] telePositionPair) {
      ObservingProgram op = new ObservingProgram();
      op.setPlanNo(sp.getPlanNo());
      SciencePlan.TELESCOPELOC spTelescopeLocation = sp.getTelescopeLocation();
      String shortTelescopeLocation = String.valueOf(spTelescopeLocation) == "HAWAII" ? "N" : "S";
      op.setGeminiLocation(shortTelescopeLocation);
      op.setOpticsPrimary(opticsPrimary);
      op.setfStop(fStop);
      op.setOpticsSecondaryRMS(opticsSecondaryRMS);
      op.setScienceFoldMirrorDegree(scienceFoldMirrorDegree);
      op.setScienceFoldMirrorType(scienceFoldMirrorType);
      op.setModuleContent(moduleContent);
      op.setCalibrationUnit(calibrationUnit);
      op.setLightType(lightType);
      op.setTelePositionPair(telePositionPair);
      return op;
   }

   public boolean saveObservingProgram(ObservingProgram op) {
      boolean validateStatus = op.getValidationStatus();
      int planNo = op.getPlanNo();
      String geminiLoc = op.getGeminiLocation();
      String opticsPrimary = op.getOpticsPrimary();
      double fStop = op.getfStop();
      double opticsSec = op.getOpticsSecondaryRMS();
      double sciFoldMirDegree = op.getScienceFoldMirrorDegree();
      ObservingProgramConfigs.FoldMirrorType sciFoldMirType = op.getScienceFoldMirrorType();
      int moduleContent = op.getModuleContent();
      ObservingProgramConfigs.CalibrationUnit calibrationUnit = op.getCalibrationUnit();
      ObservingProgramConfigs.LightType lightType = op.getLightType();
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "SELECT * FROM masSciencePlan WHERE planNo = " + planNo;
         ResultSet rs = stmt.executeQuery(sql);
         if (!rs.isBeforeFirst()) {
            System.out.println("can't save ObservingProgram(No Science Plan)");
         } else {
            stmt1 = conn.createStatement();
            String sql1 = "SELECT * FROM masObservingProgram WHERE planNo = " + planNo;
            ResultSet rs1 = stmt1.executeQuery(sql1);
            TelePositionPair[] telePositionPairs;
            TelePositionPair[] var28;
            int var29;
            int var30;
            TelePositionPair tp;
            if (!rs1.isBeforeFirst()) {
               System.out.println("Insert");
               sql1 = " INSERT INTO masObservingProgram VALUES (" + planNo + ",'" + geminiLoc + "','" + opticsPrimary + "'," + fStop + "," + opticsSec + "," + sciFoldMirDegree + ",'" + String.valueOf(sciFoldMirType) + "'," + moduleContent + ",'" + String.valueOf(calibrationUnit) + "','" + String.valueOf(lightType) + "'," + validateStatus + ");";
               stmt1.executeUpdate(sql1);
               telePositionPairs = op.getTelePositionPair();
               var28 = telePositionPairs;
               var29 = telePositionPairs.length;

               for(var30 = 0; var30 < var29; ++var30) {
                  tp = var28[var30];
                  sql1 = " INSERT INTO masTelePositionPair VALUES (" + planNo + "," + tp.getDirection() + "," + tp.getDegree() + ");";
                  stmt1.executeUpdate(sql1);
               }
            } else {
               System.out.println("Update");
               sql1 = " UPDATE masObservingProgram SET opticsPrimary = '" + opticsPrimary + "', fStop = " + fStop + " ,opticsSecondaryRMS = " + opticsSec + ", scienceFoldMirrorDegree = " + sciFoldMirDegree + " ,scienceFoldMirrorType ='" + String.valueOf(sciFoldMirType) + "', moduleContent = " + moduleContent + " ,calibrationUnit ='" + String.valueOf(calibrationUnit) + "',lightType = '" + String.valueOf(lightType) + "' ,validationStatus = " + validateStatus + " WHERE planNo = " + planNo;
               stmt1.executeUpdate(sql1);
               telePositionPairs = op.getTelePositionPair();
               var28 = telePositionPairs;
               var29 = telePositionPairs.length;

               for(var30 = 0; var30 < var29; ++var30) {
                  tp = var28[var30];
                  double var10000 = tp.getDirection();
                  sql1 = " UPDATE masTelePositionPair SET direction = " + var10000 + ", degree = " + tp.getDegree() + " WHERE planNo = " + planNo;
                  stmt1.executeUpdate(sql1);
               }
            }

            stmt1.close();
         }

         stmt.close();
         conn.close();
      } catch (SQLException var47) {
         var47.printStackTrace();
      } catch (Exception var48) {
         var48.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var46) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var45) {
            var45.printStackTrace();
         }

      }

      return true;
   }

   private ObservingProgram[] getObservingPrograms() {
      ObservingProgram[] observingPrograms = new ObservingProgram[sciencePlans.size()];
      return observingPrograms;
   }

   public ObservingProgram getObservingProgramBySciencePlan(SciencePlan sp) {
      ObservingProgram op = new ObservingProgram();
      SciencePlan.TELESCOPELOC spTelescopeLocation = sp.getTelescopeLocation();
      String shortTelescopeLocation = String.valueOf(spTelescopeLocation) == "HAWAII" ? "N" : "S";
      int id = sp.getPlanNo();
      String JDBC_DRIVER = "org.h2.Driver";
      String DB_URL = connectdb;
      String USER = "sa";
      String PASS = "";
      Connection conn = null;
      Statement stmt = null;
      Statement stmt1 = null;

      try {
         Class.forName("org.h2.Driver");
         conn = DriverManager.getConnection(connectdb, "sa", "");
         stmt = conn.createStatement();
         String sql = "";
         sql = "SELECT * FROM masObservingProgram WHERE planNo = " + sp.getPlanNo();
         ResultSet rs = stmt.executeQuery(sql);
         if (!rs.isBeforeFirst()) {
            System.out.println("No ObservingProgram Data");
         } else {
            while(rs.next()) {
               op.setPlanNo(rs.getInt("planNo"));
               op.setGeminiLocation(shortTelescopeLocation);
               op.setOpticsPrimary(rs.getString("opticsPrimary"));
               op.setfStop(rs.getDouble("fStop"));
               op.setOpticsSecondaryRMS(rs.getDouble("opticsSecondaryRMS"));
               op.setScienceFoldMirrorDegree(rs.getDouble("scienceFoldMirrorDegree"));
               op.setScienceFoldMirrorType(FoldMirrorType.valueOf(rs.getString("scienceFoldMirrorType")));
               op.setModuleContent(rs.getInt("moduleContent"));
               op.setCalibrationUnit(CalibrationUnit.valueOf(rs.getString("calibrationUnit")));
               op.setLightType(LightType.valueOf(rs.getString("lightType")));
               op.setValidationStatus(rs.getBoolean("validationStatus"));
               String sql1 = "SELECT * FROM masTelePositionPair WHERE planNo = " + sp.getPlanNo();
               stmt1 = conn.createStatement();
               ResultSet rs1 = stmt1.executeQuery(sql1);
               int size = 0;
               if (rs1 != null) {
                  rs1.last();
                  size = rs1.getRow();
               }

               TelePositionPair[] telePositionPairs = new TelePositionPair[size];
               rs1 = stmt1.executeQuery(sql1);

               for(int indexTellPos = 0; rs1.next(); ++indexTellPos) {
                  TelePositionPair telePositionPair1 = new TelePositionPair(rs1.getDouble("direction"), rs1.getDouble("degree"));
                  telePositionPairs[indexTellPos] = telePositionPair1;
                  op.setTelePositionPair(telePositionPairs);
               }
            }
         }

         stmt.close();
         conn.close();
      } catch (SQLException var36) {
         var36.printStackTrace();
      } catch (Exception var37) {
         var37.printStackTrace();
      } finally {
         try {
            if (stmt != null) {
               stmt.close();
            }
         } catch (SQLException var35) {
         }

         try {
            if (conn != null) {
               conn.close();
            }
         } catch (SQLException var34) {
            var34.printStackTrace();
         }

      }

      return op;
   }

   public static void getDefaultConfiguration() throws IOException {
      String workingDir = System.getProperty("user.dir");
      File defaultFile = new File(workingDir, "/references/gemini_config_default.json");
      InputStream inputStream = new FileInputStream(defaultFile);
      if (inputStream == null) {
         System.out.println("File not found in resources!");
      } else {
         String jsonText = (String)(new BufferedReader(new InputStreamReader(inputStream))).lines().collect(Collectors.joining("/n"));
         JSONObject json = new JSONObject(jsonText);
         String userHome = System.getProperty("user.home");
         File downloads = new File(userHome, "Downloads");
         File currentFile = new File(workingDir, "/references/gemini_config_current.json");
         File outFile = new File(downloads, "gemini_config_current.json");

         FileWriter writer;
         try {
            writer = new FileWriter(currentFile);

            try {
               writer.write(json.toString(4));
            } catch (Throwable var16) {
               try {
                  writer.close();
               } catch (Throwable var15) {
                  var16.addSuppressed(var15);
               }

               throw var16;
            }

            writer.close();
         } catch (IOException var17) {
            System.err.println("Failed to save file: " + var17.getMessage());
            var17.printStackTrace();
         }

         try {
            writer = new FileWriter(outFile);

            try {
               writer.write(json.toString(4));
               System.out.println("JSON saved to: " + outFile.getAbsolutePath());
            } catch (Throwable var13) {
               try {
                  writer.close();
               } catch (Throwable var12) {
                  var13.addSuppressed(var12);
               }

               throw var13;
            }

            writer.close();
         } catch (IOException var14) {
            System.err.println("Failed to save file: " + var14.getMessage());
            var14.printStackTrace();
         }

      }
   }

   public static void getCurrentConfiguration() throws IOException {
      try {
         String workingDir = System.getProperty("user.dir");
         File currentFile = new File(workingDir, "/resources/gemini_config_current.json");
         InputStream inputStream = new FileInputStream(currentFile);
         if (inputStream == null) {
            return;
         }

         String jsonText = (String)(new BufferedReader(new InputStreamReader(inputStream))).lines().collect(Collectors.joining("/n"));
         JSONObject json = new JSONObject(jsonText);
         String userHome = System.getProperty("user.home");
         File downloads = new File(userHome, "Downloads");
         File outFile = new File(downloads, "gemini_config_current.json");

         try {
            FileWriter writer = new FileWriter(outFile);

            try {
               writer.write(json.toString(4));
               System.out.println("JSON saved to: " + outFile.getAbsolutePath());
            } catch (Throwable var12) {
               try {
                  writer.close();
               } catch (Throwable var11) {
                  var12.addSuppressed(var11);
               }

               throw var12;
            }

            writer.close();
         } catch (IOException var13) {
            System.err.println("Failed to save file: " + var13.getMessage());
            var13.printStackTrace();
         }
      } catch (IOException var14) {
         getDefaultConfiguration();
      }

   }

   public String updateConfiguration() throws FileNotFoundException {
      String msg = "";
      String userHome = System.getProperty("user.home");
      File downloads = new File(userHome, "Downloads/gemini_config_current.json");
      InputStream inputStream = new FileInputStream(downloads);
      String jsonText = (String)(new BufferedReader(new InputStreamReader(inputStream))).lines().collect(Collectors.joining("/n"));
      boolean jsonValid = this.isJSONValid(jsonText);
      if (!jsonValid) {
         msg = "FAILED: The provided Gemini configuration is in a wrong format. Please reupload the correctly formatted configuration file again.";
      } else {
         JSONObject json = new JSONObject(jsonText);
         String workingDir = System.getProperty("user.dir");
         File currentFile = new File(workingDir, "/references/gemini_config_current.json");

         try {
            FileWriter writer = new FileWriter(currentFile);

            try {
               writer.write(json.toString(4));
               msg = "SUCCESS: The new Gemini configuration is already updated.";
            } catch (Throwable var14) {
               try {
                  writer.close();
               } catch (Throwable var13) {
                  var14.addSuppressed(var13);
               }

               throw var14;
            }

            writer.close();
         } catch (IOException var15) {
            System.err.println("Failed to save file: " + var15.getMessage());
            var15.printStackTrace();
         }
      }

      return msg;
   }

   public boolean isJSONValid(String test) {
      try {
         new JSONObject(test);
      } catch (JSONException var5) {
         System.err.println("ERROR : " + var5.getMessage());

         try {
            new JSONArray(test);
         } catch (JSONException var4) {
            System.err.println("ERROR : " + var4.getMessage());
            return false;
         }
      }

      return true;
   }
}

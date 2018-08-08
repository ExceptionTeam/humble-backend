import java.io.*;
import java.util.ArrayList;

public class Main {

    public ArrayList<Long> readFromFile() {
        ArrayList<Long> dots = new ArrayList();
        File input = new File("input.txt");
        try (BufferedReader br = new BufferedReader(new FileReader(input))) {
            String line;
            while ((line = br.readLine()) != null) {
                Long element = Long.parseLong(line);
                if(!dots.contains(element)) {
                    dots.add(element);
                }
            }
        } catch (Exception e) {
            System.out.println("Exception: " + e.toString());
        }
        return dots;
    }

    public void printResult() throws IOException {
        File output = new File("output.txt");
        if(output.exists()){
            output.delete();
        }
	try(PrintWriter pw = new PrintWriter(new FileWriter(output, true), true)){     
            long result = 0;
            ArrayList<Long> dots = readFromFile();
            for (Long element : dots) {
                result += element;
            }
            pw.print(result);
	} catch (Exception e) {
            System.out.println("Exception: " + e.toString());
        }
    }

    public static void main(String[] args) {
        Main prog = new Main();
        try {
            prog.printResult();
        } catch(Exception e){
            e.printStackTrace();
        }
    }

}

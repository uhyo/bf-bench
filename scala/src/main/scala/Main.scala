import java.nio.file.{Files, Paths}
import scala.collection.mutable.ArrayBuffer

object Main extends App {
  val filename =
    args.headOption match {
      case None => throw new RuntimeException("Filename is invalid")
      case Some(filename) => filename
    }
  val code = loadFile(filename)

  val output = run(code)
  System.out.write(output.toArray)

  /**
   * Load entire buffer from given file.
   */
  def loadFile(filename: String): Array[Byte] = {
    Files.readAllBytes(Paths.get(filename))
  }

  /**
   * Run an interpreter.
   */
  def run(code: Array[Byte]): ArrayBuffer[Byte] = {
    val codeLength = code.length
    val output = new ArrayBuffer[Byte]()
    val memory = new Array[Byte](30000)
    val loopMap = new LoopMap(code)
    // Initialize pc and memory pointer.
    var pc = 0
    var mem = 0

    while (pc < codeLength) {
      val inst = code(pc)

      inst match {
        case 0x2b => {
          // '+'
          memory(mem) = (memory(mem) + 1).toByte
        }
        case 0x2d => {
          // '-'
          memory(mem) = (memory(mem) - 1).toByte
        }
        case 0x3c => {
          // '<'
          if (mem > 0) {
            mem -= 1
          } else {
            throw new RuntimeException("Memory pointer out of range")
          }
        }
        case 0x3e => {
          // '>'
          if (mem < 30000 - 1) {
            mem += 1
          } else {
            throw new RuntimeException("Memory pointer out of range")
          }
        }
        case 0x2e => {
          // '.'
          output += memory(mem)
        }
        case 0x5b => {
          // '['
          val loopEnd = loopMap.findEnd(pc)
          if (memory(mem) == 0) {
            pc = loopEnd
          }
        }
        case 0x5d => {
          // ']'
          if (memory(mem) != 0) {
            pc = loopMap.findStart(pc)
          }
        }
        case 0x2c => {
          // ','
          throw new RuntimeException("',' is not supported")
        }
        case _ => ()
     }

      pc += 1
    }


    return output
  }
}

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema zumgo
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema zumgo
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `zumgo` DEFAULT CHARACTER SET utf8mb4 ;
USE `zumgo` ;

-- -----------------------------------------------------
-- Table `zumgo`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`user` (
  `user_code` BIGINT NOT NULL AUTO_INCREMENT,
  `kakao_email` VARCHAR(255) NULL DEFAULT NULL,
  `kakao_id` BIGINT NULL DEFAULT NULL,
  `kakao_nickname` VARCHAR(255) NOT NULL,
  `kakao_profile_img` VARCHAR(255) NULL DEFAULT NULL,
  `point` INT NULL DEFAULT '5',
  `kakao_phone_number` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`user_code`),
  UNIQUE INDEX `UK_1s5w9jax6je5hur6ncmd8lmw4` (`kakao_nickname` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`products`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`products` (
  `product_id` BIGINT NOT NULL AUTO_INCREMENT,
  `created_date` DATETIME(6) NULL DEFAULT NULL,
  `modified_date` DATETIME(6) NULL DEFAULT NULL,
  `available_time` VARCHAR(255) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `price` INT NOT NULL,
  `reserve` DATETIME(6) NULL DEFAULT NULL,
  `status` VARCHAR(255) NULL DEFAULT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `user_id` BIGINT NOT NULL,
  PRIMARY KEY (`product_id`),
  INDEX `FKhqw0i9tv44oekhnpggx9lbix2` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKhqw0i9tv44oekhnpggx9lbix2`
    FOREIGN KEY (`user_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`bill`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`bill` (
  `bill_id` BIGINT NOT NULL AUTO_INCREMENT,
  `review` VARCHAR(255) NULL DEFAULT NULL,
  `buyer_id` BIGINT NULL DEFAULT NULL,
  `product_id` BIGINT NULL DEFAULT NULL,
  `seller_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  UNIQUE INDEX `UK_rego5cwbrwe7nos6wrt1gnabq` (`product_id` ASC) VISIBLE,
  INDEX `FKkurhoqjirffn15yhfp9mhmpse` (`buyer_id` ASC) VISIBLE,
  INDEX `FKi4i0u2ri6xrvd5awwgt53yakk` (`seller_id` ASC) VISIBLE,
  CONSTRAINT `FK3d88a66hwipb0mcbqj8517nvf`
    FOREIGN KEY (`product_id`)
    REFERENCES `zumgo`.`products` (`product_id`),
  CONSTRAINT `FKi4i0u2ri6xrvd5awwgt53yakk`
    FOREIGN KEY (`seller_id`)
    REFERENCES `zumgo`.`user` (`user_code`),
  CONSTRAINT `FKkurhoqjirffn15yhfp9mhmpse`
    FOREIGN KEY (`buyer_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`chat_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`chat_room` (
  `chat_room_id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_room_code` VARCHAR(255) NULL DEFAULT NULL,
  `buyer_id` BIGINT NULL DEFAULT NULL,
  `seller_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`chat_room_id`),
  INDEX `FK2q20pxb4lx2kdckrnv9griig3` (`buyer_id` ASC) VISIBLE,
  INDEX `FK5kus9555qsn3xe7bvcbxi413w` (`seller_id` ASC) VISIBLE,
  CONSTRAINT `FK2q20pxb4lx2kdckrnv9griig3`
    FOREIGN KEY (`buyer_id`)
    REFERENCES `zumgo`.`user` (`user_code`),
  CONSTRAINT `FK5kus9555qsn3xe7bvcbxi413w`
    FOREIGN KEY (`seller_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`chat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`chat` (
  `chat_id` BIGINT NOT NULL AUTO_INCREMENT,
  `chat_content` VARCHAR(255) NULL DEFAULT NULL,
  `chat_date` DATETIME(6) NULL DEFAULT NULL,
  `chatter_id` BIGINT NULL DEFAULT NULL,
  `chat_room_id` BIGINT NOT NULL,
  PRIMARY KEY (`chat_id`),
  INDEX `FK44b6elhh512d2722l09i6qdku` (`chat_room_id` ASC) VISIBLE,
  CONSTRAINT `FK44b6elhh512d2722l09i6qdku`
    FOREIGN KEY (`chat_room_id`)
    REFERENCES `zumgo`.`chat_room` (`chat_room_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 42
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`img`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`img` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `img_url` VARCHAR(255) NOT NULL,
  `product_id` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK7nyuohnv5up7llkmc3csf94vy` (`product_id` ASC) VISIBLE,
  CONSTRAINT `FK7nyuohnv5up7llkmc3csf94vy`
    FOREIGN KEY (`product_id`)
    REFERENCES `zumgo`.`products` (`product_id`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`live_room`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`live_room` (
  `live_room_id` BIGINT NOT NULL AUTO_INCREMENT,
  `applicants` INT NOT NULL,
  `final_bid` INT NOT NULL,
  `live_end_time` DATETIME(6) NULL DEFAULT NULL,
  `live_start_time` DATETIME(6) NULL DEFAULT NULL,
  `live_status` VARCHAR(255) NULL DEFAULT NULL,
  `now_bid` INT NOT NULL,
  `title` VARCHAR(255) NULL DEFAULT NULL,
  `viewers` INT NOT NULL,
  `product_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`live_room_id`),
  INDEX `FKp9ys1efrrs2rl3xlqgg2ntcn9` (`product_id` ASC) VISIBLE,
  CONSTRAINT `FKp9ys1efrrs2rl3xlqgg2ntcn9`
    FOREIGN KEY (`product_id`)
    REFERENCES `zumgo`.`products` (`product_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`live_bid`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`live_bid` (
  `live_bid_id` BIGINT NOT NULL AUTO_INCREMENT,
  `bid_price` INT NOT NULL,
  `bid_time` DATETIME(6) NULL DEFAULT NULL,
  `bidder` VARCHAR(255) NULL DEFAULT NULL,
  `live_room_id` BIGINT NOT NULL,
  PRIMARY KEY (`live_bid_id`),
  INDEX `FKmpud9je3qk4381serjmys2cl3` (`live_room_id` ASC) VISIBLE,
  CONSTRAINT `FKmpud9je3qk4381serjmys2cl3`
    FOREIGN KEY (`live_room_id`)
    REFERENCES `zumgo`.`live_room` (`live_room_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`live_request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`live_request` (
  `live_request_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NULL DEFAULT NULL,
  `user_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`live_request_id`),
  INDEX `FKkfysxse6re3gpgqllh48kv0qx` (`product_id` ASC) VISIBLE,
  INDEX `FKmcvru7xmtel2o0rqe3vlkvpkb` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKkfysxse6re3gpgqllh48kv0qx`
    FOREIGN KEY (`product_id`)
    REFERENCES `zumgo`.`products` (`product_id`),
  CONSTRAINT `FKmcvru7xmtel2o0rqe3vlkvpkb`
    FOREIGN KEY (`user_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
AUTO_INCREMENT = 26
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`report` (
  `report_id` BIGINT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(255) NULL DEFAULT NULL,
  `reported_id` BIGINT NULL DEFAULT NULL,
  `reporter_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`report_id`),
  INDEX `FKkqwu7egf4fup0xog0ot2s065c` (`reported_id` ASC) VISIBLE,
  INDEX `FKndpjl61ubcm2tkf7ml1ynq13t` (`reporter_id` ASC) VISIBLE,
  CONSTRAINT `FKkqwu7egf4fup0xog0ot2s065c`
    FOREIGN KEY (`reported_id`)
    REFERENCES `zumgo`.`user` (`user_code`),
  CONSTRAINT `FKndpjl61ubcm2tkf7ml1ynq13t`
    FOREIGN KEY (`reporter_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`user_live`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`user_live` (
  `use_live_id` BIGINT NOT NULL AUTO_INCREMENT,
  `live_room_id` BIGINT NULL DEFAULT NULL,
  `user_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`use_live_id`),
  INDEX `FKhf4coan07bkclmlkih51rf2wt` (`live_room_id` ASC) VISIBLE,
  INDEX `FKkce09secjt9lfnvn0appox3bd` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FKhf4coan07bkclmlkih51rf2wt`
    FOREIGN KEY (`live_room_id`)
    REFERENCES `zumgo`.`live_room` (`live_room_id`),
  CONSTRAINT `FKkce09secjt9lfnvn0appox3bd`
    FOREIGN KEY (`user_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;


-- -----------------------------------------------------
-- Table `zumgo`.`wish`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `zumgo`.`wish` (
  `wish_id` BIGINT NOT NULL AUTO_INCREMENT,
  `product_id` BIGINT NULL DEFAULT NULL,
  `user_id` BIGINT NULL DEFAULT NULL,
  PRIMARY KEY (`wish_id`),
  INDEX `FK5rdsloxojn3nht9a90bt009lc` (`product_id` ASC) VISIBLE,
  INDEX `FKkqi4lso34o5xjkhiw71uadwvu` (`user_id` ASC) VISIBLE,
  CONSTRAINT `FK5rdsloxojn3nht9a90bt009lc`
    FOREIGN KEY (`product_id`)
    REFERENCES `zumgo`.`products` (`product_id`),
  CONSTRAINT `FKkqi4lso34o5xjkhiw71uadwvu`
    FOREIGN KEY (`user_id`)
    REFERENCES `zumgo`.`user` (`user_code`))
ENGINE = InnoDB
AUTO_INCREMENT = 5
DEFAULT CHARACTER SET = utf8mb4;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
